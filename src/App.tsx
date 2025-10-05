import { RouterProvider } from 'react-router-dom';
import { AppProviders } from '@/app/providers';
import { router } from '@/app/routes';
import { AppPreloader } from '@/components/AppPreloader';

function App() {
  return (
    <AppProviders>
      <AppPreloader>
        <RouterProvider router={router} />
      </AppPreloader>
    </AppProviders>
  );
}

export default App;