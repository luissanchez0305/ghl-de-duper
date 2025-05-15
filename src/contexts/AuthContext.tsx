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
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
  handleOAuthCallback: (code: string, locationId: string) => Promise<void>;
  initiateGHLAuth: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
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
const GHL_REDIRECT_URI = `${window.location.origin}/oauth/callback`;

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
    const authUrl = `https://marketplace.gohighlevel.com/oauth/chooselocation?response_type=code&client_id=${GHL_CLIENT_ID}&redirect_uri=${encodeURIComponent(GHL_REDIRECT_URI)}&scope=contacts.readonly contacts.write`;
    window.location.href = authUrl;
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
      
      if (user) {
        const updatedUser = {
          ...user,
          accessToken: access_token,
          locationId,
        };
        console.log('Updating user with OAuth data:', updatedUser);
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error('OAuth token exchange error:', error);
      throw error;
    }
  };
  
  const login = async (email: string, password: string) => {
    console.log('Attempting login:', { email });
    setIsLoading(true);
    try {
      const demoUser: User = {
        id: '1',
        name: 'Demo User',
        email: email,
        plan: 'free',
      };
      
      console.log('Login successful, setting user:', demoUser);
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      toast.success('Successfully logged in!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to log in. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    console.log('Attempting signup:', { email, name });
    setIsLoading(true);
    try {
      const demoUser: User = {
        id: '1',
        name: name,
        email: email,
        plan: 'free',
      };
      
      console.log('Signup successful, setting user:', demoUser);
      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      toast.success('Successfully signed up!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to sign up. Please try again.');
      throw error;
    } finally {
      setIsLoading(false);
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
      login,
      signup,
      logout,
      isLoading,
      isAuthenticated: !!user,
      handleOAuthCallback,
      initiateGHLAuth,
    }}>
      {children}
    </AuthContext.Provider>
  );
};