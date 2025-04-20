import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

// This will be used for the home/landing page
export default function MainLayout() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary text-cream p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - Always on left */}
          <h1 className="text-2xl font-bold">Postify</h1>
          
          {/* Login/Register buttons for non-authenticated users */}
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-cream text-primary font-medium rounded hover:bg-opacity-90 transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 border border-cream text-cream font-medium rounded hover:bg-cream hover:bg-opacity-10 transition"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area - This is where the Outlet will render the child routes */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-primary text-cream py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}