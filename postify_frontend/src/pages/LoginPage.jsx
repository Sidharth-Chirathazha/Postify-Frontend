import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';
import { loginUser, clearError } from '../redux/slices/authSlice';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });
  const { loading, error } = useSelector((state) => state.auth);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      showErrorToast(error);
      console.error('Login error:', error);
      dispatch(clearError());
    }
  }, [error, dispatch]); 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await dispatch(loginUser(formData)).unwrap();
      showSuccessToast('Logged in successfully!');
      if (response.user.role === 'user') {
        navigate('/user/home');
      } else if (response.user.role === 'admin') {
        navigate('/admin/home');
      }
    } catch (error) {    
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex">
      {/* Left Column - Brand */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-cream mb-4 cursor-pointer" onClick={()=> navigate('/')}>Postify</h1>
          <p className="text-xl text-cream/90 mb-6">
          Unleash your voice, discover stories, and connect through creativity.
          </p>
          {/* <div className="bg-black/40 border border-cream/20 p-6 rounded-lg backdrop-blur-sm">
            <p className="text-cream font-medium">Join thousands of storytellers and discover content that inspires, challenges, and connects.</p>
          </div> */}
        </div>
      </div>
      
      {/* Right Column - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream rounded-lg shadow-2xl p-8">
          {/* Mobile only brand display */}
          <div className="text-center mb-6 md:hidden">
            <h1 className="text-3xl font-bold text-black cursor-pointer" onClick={()=>navigate('/')}>Postify</h1>
            <p className="text-black/70 mt-2">Where words come alive.</p>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-black">Welcome Back</h1>
            <p className="text-black/70 mt-2">Sign in to your account to continue</p>
          </div>
          
          {/* Role Toggle Selector */}
          <div className="flex rounded-lg bg-cream-100 mb-8 overflow-hidden border border-gray-300">
            <button
              type="button"
              className={`flex-1 py-3 text-center text-sm font-medium transition ${
                formData.role === 'user' 
                  ? 'bg-black text-cream' 
                  : 'bg-cream-100 text-black/70 hover:bg-gray-200'
              }`}
              onClick={() => handleRoleToggle('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`flex-1 py-3 text-center text-sm font-medium transition ${
                formData.role === 'admin' 
                  ? 'bg-black text-cream' 
                  : 'bg-cream-100 text-black/70 hover:bg-gray-200'
              }`}
              onClick={() => handleRoleToggle('admin')}
            >
              Admin
            </button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                Username or Email
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-cream-50"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-cream-50"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-md transition font-medium ${
                loading
                  ? 'bg-black/70 cursor-not-allowed'
                  : 'bg-black hover:bg-gray-800'
              } text-cream`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <div className="mt-6 text-center">
              <p className="text-black/70">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/register')}
                  className="text-black font-medium hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}