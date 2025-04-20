import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';

export default function AdminLayout({ user }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  

  const displayName = user?.name?.split(' ')[0] || user?.username || 'Admin';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary text-cream p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - Always on left */}
          <h1 className="text-2xl font-bold">Postify Admin</h1>
          
          {/* Nav Items for admin - Centered */}
          <div className="hidden md:flex space-x-6 items-center justify-center flex-1">
            <button onClick={() => navigate('/admin/dashboard')} className="text-cream hover:text-cream/80 transition">
              Dashboard
            </button>
            <button onClick={() => navigate('/admin/users')} className="text-cream hover:text-cream/80 transition">
              Users
            </button>
            <button onClick={() => navigate('/admin/posts')} className="text-cream hover:text-cream/80 transition">
              Posts
            </button>
            <button onClick={() => navigate('/admin/settings')} className="text-cream hover:text-cream/80 transition">
              Settings
            </button>
          </div>
          
          {/* Admin Profile Display + Logout - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <div className="mr-2">
                <div className="h-8 w-8 rounded-full bg-cream text-primary flex items-center justify-center font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="text-cream">Welcome, {displayName}</span>
            </div>
            <button 
              onClick={() => {/* Handle logout */}}
              className="px-4 py-2 bg-cream text-primary font-medium rounded hover:bg-opacity-90 transition"
            >
              Logout
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="text-cream p-2"
            >
              ☰
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div className={`md:hidden ${mobileMenuOpen ? 'block' : 'hidden'}`}>
          {/* Admin Profile Display for Mobile */}
          <div className="px-3 py-2 border-b border-primary-dark flex items-center">
            <div className="mr-2">
              <div className="h-8 w-8 rounded-full bg-cream text-primary flex items-center justify-center font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-cream">Welcome, {displayName}</span>
          </div>
          
          <div className="pt-2 pb-3 space-y-1">
            <button 
              onClick={() => navigate('/admin/dashboard')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate('/admin/users')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Users
            </button>
            <button 
              onClick={() => navigate('/admin/posts')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Posts
            </button>
            <button 
              onClick={() => navigate('/admin/settings')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Settings
            </button>
            {/* Logout button in mobile menu */}
            <button 
              onClick={() => {/* Handle logout */}} 
              className="block px-3 py-2 w-full text-left text-cream font-medium bg-red-600 hover:bg-red-700 transition mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-primary text-cream py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BlogSphere Admin Panel. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}