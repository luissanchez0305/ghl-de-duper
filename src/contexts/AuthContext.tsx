import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import toast from 'react-hot-toast';

interface User {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'enterprise';
  accessToken?: string;
  locationId?: string;
}

interface AuthContextType {
  user: User | null;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  handleOAuthCallback: (code: string, locationId: string) => Promise<void>;
  initiateGHLAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  logout: () => {},
  isLoading: true,
  isAuthenticated: false,
  handleOAuthCallback: async () => {},
  initiateGHLAuth: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const GHL_CLIENT_ID = import.meta.env.VITE_GHL_CLIENT_ID || 'your-client-id';
const GHL_REDIRECT_URI = `${window.location.origin}/oauth/token`;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    console.log('AuthProvider mounted');
    const storedUser = localStorage.getItem('user');
    const accessToken = localStorage.getItem('ghl_access_token');
    const locationId = localStorage.getItem('ghl_location_id');
    
    console.log('Stored credentials:', {
      hasUser: !!storedUser,
      hasAccessToken: !!accessToken,
      hasLocationId: !!locationId
    });
    
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      console.log('Restored user data:', userData);
      setUser({
        ...userData,
        accessToken,
        locationId,
      });
    }
    setIsLoading(false);
  }, []);
  
  const initiateGHLAuth = () => {
    console.log('Initiating GHL OAuth flow');
    console.log('Redirect URI:', GHL_REDIRECT_URI);
    const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${GHL_CLIENT_ID}&redirect_uri=${encodeURIComponent(GHL_REDIRECT_URI)}`;
    
    // Open OAuth in a popup window
    const popup = window.open(
      authUrl,
      'ghl-oauth',
      'width=600,height=700,scrollbars=yes,resizable=yes'
    );
    
    // Listen for the popup to close or send a message
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Check if tokens were stored
        const accessToken = localStorage.getItem('ghl_access_token');
        if (accessToken) {
          window.location.reload();
        }
      }
    }, 1000);
  };
  
  const handleOAuthCallback = async (code: string, locationId: string) => {
    console.log('Handling OAuth callback:', { code, locationId });
    try {
      const response = await fetch('http://localhost:3000/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          locationId,
          redirectUri: GHL_REDIRECT_URI,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to exchange code for token');
      }
      
      const data = await response.json();
      console.log('OAuth token exchange successful:', { hasAccessToken: !!data.access_token, hasRefreshToken: !!data.refresh_token });
      
      const { access_token, refresh_token } = data;
      
      localStorage.setItem('ghl_access_token', access_token);
      localStorage.setItem('ghl_refresh_token', refresh_token);
      localStorage.setItem('ghl_location_id', locationId);
      
      // Create user from OAuth data
      const newUser: User = {
        id: locationId,
        name: 'GoHighLevel User',
        email: '',
        plan: 'free',
        accessToken: access_token,
        locationId,
      };
      
      console.log('Creating user with OAuth data:', newUser);
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
    } catch (error) {
      console.error('OAuth token exchange error:', error);
      throw error;
    }
  };
  
  
  const logout = () => {
    console.log('Logging out user:', user?.email);
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('ghl_access_token');
    localStorage.removeItem('ghl_refresh_token');
    localStorage.removeItem('ghl_location_id');
    toast.success('Successfully logged out!');
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      logout,
      isLoading,
      isAuthenticated: !!user && !!user.accessToken,
      handleOAuthCallback,
      initiateGHLAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};