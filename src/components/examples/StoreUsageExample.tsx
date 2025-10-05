import React from 'react';
import { useAppStore } from '@/store';

/**
 * Example component demonstrating how to use the Zustand stores
 * This shows the proper patterns for accessing store data and actions
 */
const StoreUsageExample: React.FC = () => {
  // App store usage
  const {
    theme,
    sidebarOpen,
    notifications,
    globalLoading,
    preferences,
    toggleTheme,
    setSidebarOpen,
    addNotification,
    setGlobalLoading,
    updatePreferences,
  } = useAppStore();

  // Example functions to demonstrate store usage
  const handleToggleTheme = () => {
    toggleTheme();
  };

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleAddNotification = () => {
    addNotification({
      type: 'info',
      title: 'Example Notification',
      message: 'This is a sample notification',
      duration: 3000,
      timestamp: Date.now(),
    });
  };

  const handleUpdatePreferences = () => {
    updatePreferences({
      itemsPerPage: 20,
      autoRefresh: true,
    });
  };

  const handleSetLoading = () => {
    setGlobalLoading(true);
    // Simulate async operation
    setTimeout(() => setGlobalLoading(false), 2000);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Store Usage Example</h1>

      {/* App State Display */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold">Current Theme</h3>
          <p className="text-lg">{theme}</p>
        </div>
        <div className="bg-purple-100 p-4 rounded-lg">
          <h3 className="font-semibold">Sidebar Open</h3>
          <p className="text-lg">{sidebarOpen ? 'Yes' : 'No'}</p>
        </div>
        <div className="bg-orange-100 p-4 rounded-lg">
          <h3 className="font-semibold">Global Loading</h3>
          <p className="text-lg">{globalLoading ? 'Loading...' : 'Ready'}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-lg">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-lg">{notifications.length}</p>
        </div>
      </div>

      {/* User Preferences */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">User Preferences</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Language:</strong> {preferences.language}</p>
            <p><strong>Timezone:</strong> {preferences.timezone}</p>
          </div>
          <div>
            <p><strong>Items per page:</strong> {preferences.itemsPerPage}</p>
            <p><strong>Auto refresh:</strong> {preferences.autoRefresh ? 'Enabled' : 'Disabled'}</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {notifications.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Notifications</h2>
          <div className="space-y-2">
            {notifications.slice(-3).map((notification) => (
              <div key={notification.id} className="p-3 border rounded bg-gray-50">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">{notification.title}</p>
                    {notification.message && <p className="text-gray-600">{notification.message}</p>}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs ${
                    notification.type === 'error' ? 'bg-red-100 text-red-800' :
                    notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                    notification.type === 'success' ? 'bg-green-100 text-green-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {notification.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={handleToggleTheme}
          className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
        >
          Toggle Theme
        </button>
        <button
          onClick={handleToggleSidebar}
          className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
        >
          Toggle Sidebar
        </button>
        <button
          onClick={handleAddNotification}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Add Notification
        </button>
        <button
          onClick={handleUpdatePreferences}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Update Preferences
        </button>
        <button
          onClick={handleSetLoading}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Test Loading
        </button>
      </div>
    </div>
  );
};

export default StoreUsageExample;