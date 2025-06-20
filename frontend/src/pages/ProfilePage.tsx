import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { shop } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleRefreshToken = async () => {
    try {
      setIsLoading(true);
      // Call the backend to refresh the token
      const response = await fetch('/api/auth/shopify/refresh', {
        method: 'POST',
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      
      toast.success('Token refreshed successfully');
      // Auth state will be updated automatically
    } catch (error) {
      console.error('Token refresh failed:', error);
      toast.error('Failed to refresh token. Please try logging in again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShopDisconnect = async () => {
    try {
      const response = await fetch('/api/auth/disconnect', {
        method: 'POST',
        credentials: 'include'
      });
      
      if (response.ok) {
        toast.success('Shop disconnected successfully');
        // Redirect to home page after disconnect
        window.location.href = '/';
      } else {
        throw new Error('Failed to disconnect shop');
      }
    } catch (error) {
      console.error('Error disconnecting shop:', error);
      toast.error('Failed to disconnect shop');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile & Settings</h1>
      
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Store Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Shop Name</label>
            <div className="mt-1 text-gray-900">{shop}</div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Authentication</h2>
        <div className="space-y-4">
          <div>
            <button
              onClick={handleRefreshToken}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? 'Refreshing...' : 'Refresh Token'}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          <div>
            <button
              onClick={handleShopDisconnect}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Disconnect Store
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 