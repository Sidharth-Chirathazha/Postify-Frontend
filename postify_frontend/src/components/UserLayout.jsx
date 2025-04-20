import React, { useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { useDispatch } from 'react-redux';
import { logout, logoutUser } from '../redux/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';    

export default function UserLayout({ user }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dispatch = useDispatch();
  
  // Get user's first name or username for display
  const displayName = user?.name?.split(' ')[0] || user?.username || 'User';

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();  
      dispatch(logout());                     
      showSuccessToast('Logged out successfully!');
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      showErrorToast('An error occurred during logout.');
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary text-cream p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo - Always on left */}
          <h1 className="text-2xl font-bold">Postify</h1>
          
          {/* Nav Items for authenticated users - Centered */}
          <div className="hidden md:flex space-x-8 items-center justify-center flex-1">
            <button onClick={() => navigate('/explore')} className="text-cream hover:text-cream/80 transition">
              Explore
            </button>
            <button onClick={() => navigate('/my-posts')} className="text-cream hover:text-cream/80 transition">
              My Posts
            </button>
            <button onClick={() => navigate('/user/profile')} className="text-cream hover:text-cream/80 transition">
              Profile
            </button>
          </div>
          
          {/* User Profile Display + Logout - Hidden on mobile, visible on desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center">
              <div className="mr-2">
                <div className="h-8 w-8 rounded-full bg-cream text-primary flex items-center justify-center font-medium">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              </div>
              <span className="text-cream">{displayName}</span>
            </div>
            <button 
              onClick={() => setShowConfirmDialog(true)}
              className="px-3 py-2 bg-cream text-primary font-medium rounded hover:bg-opacity-90 transition"
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
          {/* User Profile Display for Mobile */}
          <div className="px-3 py-2 border-b border-primary-dark flex items-center">
            <div className="mr-2">
              <div className="h-8 w-8 rounded-full bg-cream text-primary flex items-center justify-center font-medium">
                {displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <span className="text-cream">{displayName}</span>
          </div>
          
          <div className="pt-2 pb-3 space-y-1">
            <button 
              onClick={() => navigate('/explore')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Explore
            </button>
            <button 
              onClick={() => navigate('/my-posts')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              My Posts
            </button>
            <button 
              onClick={() => navigate('/profile')} 
              className="block px-3 py-2 w-full text-left hover:bg-primary-dark transition"
            >
              Profile
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
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
        </div>
      </footer>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to log out?"
        confirmText="Logout"
        confirmButtonColor="danger"
      />

    </div>
  );
}