import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <main style={{ flex: 1, padding: '1.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
}
