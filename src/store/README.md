# Zustand Store Architecture

This project uses Zustand for lightweight, performant state management across different features.

## Store Structure

### 1. App Store (`src/app/store.ts`)
Global application state including:
- Theme management (light/dark mode)
- Sidebar state
- Notifications system
- User preferences
- Global loading states

### 2. Auth Store (`src/features/auth/store/authSlice.ts`)
Authentication management with:
- User authentication state
- Login/logout functionality
- User profile management
- Firebase integration

## Key Features

### 🔄 Automatic State Initialization
Stores are automatically initialized after user authentication:

```typescript
// After successful login, all stores fetch data
const { isInitialized } = useStoreInitializer();
```

### 🧹 Automatic Cleanup
Auth store is automatically cleared when user logs out via the `clearAuth()` method.

### 💾 Persistence
Key state is persisted to localStorage:
- User preferences
- Filter settings
- Pagination settings
- Dashboard filters

### 🎯 Selector Hooks
Optimized selectors prevent unnecessary re-renders:

```typescript
// Instead of accessing the entire store
const { products, isLoading, error } = useProductStore();

// Use specific selectors
const products = useProducts();
const isLoading = useProductLoading();
const error = useProductError();
```

## Usage Examples

### Basic Store Usage

```typescript
import { useAppStore, useTheme, useSidebar, useNotifications } from '@/store';

function MyComponent() {
  const theme = useTheme();
  const { sidebarOpen, toggleSidebar } = useSidebar();
  const { addNotification } = useNotifications();
  
  const handleToggleTheme = () => {
    // Theme toggle logic
  };
  
  // Component logic...
}
```

### App Store Usage

```typescript
import { useAppStore } from '@/store';

function AppControls() {
  const {
    theme,
    sidebarOpen,
    notifications,
    preferences,
    toggleTheme,
    setSidebarOpen,
    addNotification,
    updatePreferences,
  } = useAppStore();

  // Use the store state and actions...
}
```

## Best Practices

### 1. Use Selector Hooks
Always use the provided selector hooks instead of accessing the store directly:

```typescript
// ✅ Good
const theme = useTheme();
const { sidebarOpen, toggleSidebar } = useSidebar();

// ❌ Avoid
const { theme, sidebarOpen, toggleSidebar } = useAppStore();
```

### 2. Handle Loading States
Always check loading states before rendering:

```typescript
const { globalLoading } = useGlobalLoading();

if (globalLoading) {
  return <LoadingSpinner />;
}
```

### 3. Notifications
Use the notification system for user feedback:

```typescript
const { addNotification } = useNotifications();

const handleSuccess = () => {
  addNotification({
    type: 'success',
    title: 'Success!',
    message: 'Operation completed successfully',
  });
};
```

## Integration with Authentication

The app store is integrated with Firebase authentication:

1. **After Login**: App state is initialized
2. **On Logout**: App state is cleared
3. **Auth State Changes**: App responds to authentication state changes

## TypeScript Support

All stores are fully typed with TypeScript interfaces:

```typescript
interface UserPreferences {
  language: string;
  timezone: string;
  dateFormat: string;
  itemsPerPage: number;
  autoRefresh: boolean;
  refreshInterval: number;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  timestamp: number;
}
```

## Performance Optimizations

1. **Selective Subscriptions**: Only subscribe to needed state slices
2. **Persistence**: Only persist necessary state
3. **Optimized Selectors**: Pre-computed derived state

## Firebase Token Integration

The app includes Firebase authentication integration for secure API access:

### Token Service

The `tokenService` handles Firebase token management:

```typescript
import { getAuthToken, getAuthHeader, isAuthenticated } from '@/services/tokenService';

// Get current token
const token = await getAuthToken();

// Get authorization header
const authHeader = await getAuthHeader();

// Check authentication status
const authenticated = isAuthenticated();
```

### API Client

The `apiClient` automatically injects Firebase tokens into all requests:

```typescript
import { apiClient } from '@/services/apiClient';

// Automatically includes Firebase tokens
const data = await apiClient.get('/api/data');
```

### Key Features

- **Automatic Token Injection**: All API requests include Firebase tokens
- **Token Refresh**: Firebase automatically refreshes tokens when needed
- **Error Handling**: 401 errors are handled gracefully
- **Type Safety**: Full TypeScript support for all API calls
