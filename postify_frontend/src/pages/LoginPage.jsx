import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    usernameOrEmail: '',
    password: '',
    role: 'user'
  });
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleToggle = (role) => {
    setFormData(prev => ({ ...prev, role }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login data:', formData);
    // After successful login, redirect to dashboard
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-primary">Welcome Back</h1>
          <p className="text-primary/70 mt-2">Sign in to your account to continue</p>
        </div>
        
        {/* Role Toggle Selector */}
        <div className="flex rounded-lg bg-gray-100 mb-8 overflow-hidden">
          <button
            type="button"
            className={`flex-1 py-3 text-center text-sm font-medium transition ${
              formData.role === 'user' 
                ? 'bg-primary text-cream' 
                : 'bg-gray-100 text-primary/70 hover:bg-gray-200'
            }`}
            onClick={() => handleRoleToggle('user')}
          >
            User
          </button>
          <button
            type="button"
            className={`flex-1 py-3 text-center text-sm font-medium transition ${
              formData.role === 'admin' 
                ? 'bg-primary text-cream' 
                : 'bg-gray-100 text-primary/70 hover:bg-gray-200'
            }`}
            onClick={() => handleRoleToggle('admin')}
          >
            Admin
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label htmlFor="usernameOrEmail" className="block text-sm font-medium text-primary mb-2">
              Username or Email
            </label>
            <input
              type="text"
              id="usernameOrEmail"
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-cream py-3 rounded-md hover:bg-primary/90 transition font-medium"
          >
            Sign In
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-primary/70">
              Don't have an account?{' '}
              <button 
                type="button"
                onClick={() => navigate('/register')}
                className="text-primary font-medium hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}