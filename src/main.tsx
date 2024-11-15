import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './pages/AppRouter.tsx';
import StoreProvider from './store/index.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StoreProvider>
      <AppRouter />
    </StoreProvider>
  </StrictMode>
);
