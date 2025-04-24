import React, { useState, useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import ConfirmDialog from './ConfirmDialog';
import { useDispatch } from 'react-redux';
import { logout, logoutUser } from '../redux/slices/authSlice';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';    

export default function UserLayout({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const dispatch = useDispatch();
  

  const displayName = user?.name?.split(' ')[0] || user?.username || 'User';


  const isActive = (path) => {
    return location.pathname.includes(path);
  };


  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

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


  const navItems = [
    { label: 'Explore', path: '/user/explore' },
    { label: 'My Posts', path: '/user/my-blogs' },
    { label: 'Profile', path: '/user/profile' }
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center">
              <h1 
                className="text-2xl font-bold text-cream cursor-pointer" 
                onClick={() => navigate('/user/explore')}
              >
                Postify
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center justify-center space-x-1">
              {navItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => navigate(item.path)} 
                  className={`px-4 py-2 mx-1 text-cream transition-all relative hover:text-white ${
                    isActive(item.path) ? 'font-medium' : ''
                  }`}
                >
                  {item.label}
                  <span 
                    className={`absolute bottom-0 left-0 w-full h-0.5 bg-cream transform origin-left transition-transform duration-300 ${
                      isActive(item.path) ? 'scale-x-100' : 'scale-x-0'
                    } group-hover:scale-x-100`}
                  />
                  {/* Hover indicator */}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-cream/70 transform origin-left transition-transform duration-300 scale-x-0 hover:scale-x-100`} />
                </button>
              ))}
            </div>
            
            {/* User Profile Display + Logout */}
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center bg-primary-light/10 rounded-full py-1 px-3">
                {user?.profile_pic ? (
                  <img 
                    src={user.profile_pic} 
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover border border-cream/30" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-cream/90 text-primary flex items-center justify-center font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-cream ml-2 text-sm">{displayName}</span>
              </div>
              <button 
                onClick={() => setShowConfirmDialog(true)}
                className="px-3 py-1.5 bg-cream text-primary text-sm font-medium rounded-md hover:bg-white transition-colors"
              >
                Logout
              </button>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              {/* Mobile profile pic */}
              <div className="mr-3">
                {user?.profile_pic ? (
                  <img 
                    src={user.profile_pic} 
                    alt={displayName}
                    className="h-8 w-8 rounded-full object-cover border border-cream/30" 
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-cream/90 text-primary flex items-center justify-center font-medium">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="text-cream p-1 rounded focus:outline-none focus:ring-1 focus:ring-cream/30"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        <div 
          className={`md:hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
          }`}
        >
          <div className="bg-primary-dark shadow-inner">
            {/* User Display for Mobile */}
            <div className="px-4 py-3 border-b border-primary-light/10 flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-cream text-sm">{displayName}</span>
              </div>
            </div>
            
            {/* Mobile Nav Items */}
            <div className="pt-1 pb-2">
              {navItems.map((item) => (
                <button 
                  key={item.path}
                  onClick={() => navigate(item.path)} 
                  className={`block w-full text-left px-4 py-2.5 text-cream hover:bg-primary-light/10 transition-colors ${
                    isActive(item.path) ? 'bg-primary-light/10 border-l-2 border-cream' : ''
                  }`}
                >
                  {item.label}
                </button>
              ))}
              
              {/* Logout button in mobile menu */}
              <button 
                onClick={() => setShowConfirmDialog(true)} 
                className="block w-full text-left px-4 py-2.5 mt-1 text-white font-medium bg-red-600/80 hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Content Area */}
      <div className="flex-grow">
        <Outlet />
      </div>

      {/* Footer */}
      <footer className="bg-primary text-cream py-5">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} Postify. All rights reserved.</p>
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