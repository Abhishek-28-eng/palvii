import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AppRoutes from './routes';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <AppRoutes />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                borderRadius: '12px',
                background: '#1B4332',
                color: '#fff',
                fontSize: '14px',
              },
              success: {
                style: { background: '#2D6A4F' },
                iconTheme: { primary: '#74C69D', secondary: '#fff' },
              },
              error: {
                style: { background: '#991B1B' },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
