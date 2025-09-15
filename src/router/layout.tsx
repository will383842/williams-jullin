// src/router/layout.tsx
import { Outlet } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Layout() {
  return (
    <HelmetProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}
