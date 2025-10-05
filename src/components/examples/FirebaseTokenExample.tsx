import React, { useEffect, useState } from 'react';
import { tokenService, getAuthToken, isAuthenticated, getUserId } from '@/services/tokenService';
import { apiClient, apiGet, apiPost } from '@/services/apiClient';

/**
 * Example component demonstrating Firebase token usage with API requests
 */
const FirebaseTokenExample: React.FC = () => {
  const [token, setToken] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [apiData, setApiData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Example 1: Check authentication status
    const authStatus = isAuthenticated();
    console.log('User authenticated:', authStatus);

    // Example 2: Get current user ID
    const currentUserId = getUserId();
    setUserId(currentUserId);

    // Example 3: Get auth token
    const fetchToken = async () => {
      const authToken = await getAuthToken();
      setToken(authToken);
    };

    fetchToken();
  }, []);

  // Example 4: Manual token usage
  const handleManualTokenUsage = async () => {
    try {
      // Get token manually
      const token = await tokenService.getIdToken();
      console.log('Manual token:', token);

      // Get auth header
      const authHeader = await tokenService.getAuthHeader();
      console.log('Auth header:', authHeader);

      // Use in fetch request
      const response = await fetch('/api/some-endpoint', {
        headers: {
          'Content-Type': 'application/json',
          ...authHeader,
        },
      });

      const data = await response.json();
      console.log('Manual API response:', data);
    } catch (error) {
      console.error('Manual token usage error:', error);
    }
  };

  // Example 5: Using the authenticated API client
  const handleApiClientUsage = async () => {
    setLoading(true);
    try {
      // Method 1: Using the client directly
      const data1 = await apiClient.get('/api/data');
      console.log('API Client data:', data1);

      // Method 2: Using convenience functions
      const data2 = await apiGet<any>('/api/user');
      setApiData(data2);

      // Method 3: POST request with data
      const newData = await apiPost<any>('/api/data', {
        name: 'Test Data',
        value: 99.99,
      });
      console.log('Created data:', newData);

    } catch (error) {
      console.error('API Client error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Example 6: Token refresh
  const handleTokenRefresh = async () => {
    try {
      const newToken = await tokenService.refreshToken();
      setToken(newToken);
      console.log('Token refreshed:', newToken);
    } catch (error) {
      console.error('Token refresh error:', error);
    }
  };

  // Example 7: Wait for auth state
  const handleWaitForAuth = async () => {
    try {
      const user = await tokenService.waitForAuth();
      console.log('Auth state ready:', user);
    } catch (error) {
      console.error('Wait for auth error:', error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Firebase Token Service Examples</h1>

      {/* Current Auth State */}
      <div className="bg-blue-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Current Authentication State</h2>
        <div className="space-y-2">
          <p><strong>Authenticated:</strong> {isAuthenticated() ? 'Yes' : 'No'}</p>
          <p><strong>User ID:</strong> {userId || 'Not available'}</p>
          <p><strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : 'Not available'}</p>
        </div>
      </div>

      {/* Token Management */}
      <div className="bg-green-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Token Management</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleTokenRefresh}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Refresh Token
          </button>
          <button
            onClick={handleWaitForAuth}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Wait for Auth
          </button>
        </div>
      </div>

      {/* API Usage Examples */}
      <div className="bg-purple-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">API Usage Examples</h2>
        <div className="flex space-x-4">
          <button
            onClick={handleManualTokenUsage}
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
          >
            Manual Token Usage
          </button>
          <button
            onClick={handleApiClientUsage}
            disabled={loading}
            className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Use API Client'}
          </button>
        </div>
      </div>

      {/* API Response */}
      {apiData && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">API Response</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
            {JSON.stringify(apiData, null, 2)}
          </pre>
        </div>
      )}

      {/* Code Examples */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Code Examples</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">1. Basic Token Usage</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{`import { getAuthToken, getAuthHeader } from '@/services/tokenService';

// Get token
const token = await getAuthToken();

// Get auth header
const authHeader = await getAuthHeader();`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">2. API Client Usage</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{`import { apiClient, apiGet, apiPost } from '@/services/apiClient';

// Using the client directly
const data = await apiClient.get('/api/data');

// Using convenience functions
const user = await apiGet('/api/user');
const newData = await apiPost('/api/data', dataObject);`}
            </pre>
          </div>

          <div>
            <h3 className="font-semibold">3. Manual Fetch with Token</h3>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
{`import { tokenService } from '@/services/tokenService';

const response = await fetch('/api/data', {
  headers: {
    'Content-Type': 'application/json',
    ...(await tokenService.getAuthHeader()),
  },
});`}
            </pre>
          </div>
        </div>
      </div>

      {/* Best Practices */}
      <div className="bg-yellow-50 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Best Practices</h2>
        <ul className="space-y-2 text-sm">
          <li>• Use <code>apiClient</code> for all API requests - it automatically handles tokens</li>
          <li>• Don't store tokens in localStorage - Firebase handles this automatically</li>
          <li>• Tokens are automatically refreshed by Firebase when needed</li>
          <li>• Use <code>isAuthenticated()</code> to check auth status</li>
          <li>• Use <code>getUserId()</code> to get the current user ID</li>
          <li>• Handle 401 errors gracefully - redirect to login if needed</li>
        </ul>
      </div>
    </div>
  );
};

export default FirebaseTokenExample;

