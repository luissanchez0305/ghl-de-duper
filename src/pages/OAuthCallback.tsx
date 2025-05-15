import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const OAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleOAuthCallback } = useAuth();
  
  useEffect(() => {
    const processOAuth = async () => {
      try {
        const code = searchParams.get('code');
        const locationId = searchParams.get('locationId');
        
        if (!code || !locationId) {
          throw new Error('Missing required OAuth parameters');
        }
        
        await handleOAuthCallback(code, locationId);
        toast.success('Successfully connected to GoHighLevel!');
        navigate('/dashboard');
      } catch (error) {
        console.error('OAuth callback error:', error);
        toast.error('Failed to connect to GoHighLevel. Please try again.');
        navigate('/auth');
      }
    };
    
    processOAuth();
  }, [searchParams, navigate, handleOAuthCallback]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <RefreshCw size={48} className="mx-auto text-primary-600 animate-spin mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Connecting to GoHighLevel
        </h2>
        <p className="text-gray-600">
          Please wait while we complete the authentication process...
        </p>
      </div>
    </div>
  );
};

export default OAuthCallback;