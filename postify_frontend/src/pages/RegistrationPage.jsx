import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/authSlice';
import { showErrorToast, showSuccessToast } from '../utils/toastConfig';

// Reusable validation rules
export const userValidationRules = {
  username: {
    required: 'Username is required',
    minLength: {
      value: 3,
      message: 'Username must be at least 3 characters long'
    },
    maxLength: {
      value: 30,
      message: 'Username cannot exceed 30 characters'
    },
    pattern: {
      value: /^[a-zA-Z0-9_]+$/,
      message: 'Username can only contain letters, numbers, and underscores'
    }
  },
  first_name: {
    pattern: {
      value: /^[a-zA-Z]+.*$/,
      message: 'First name should only contain alphabets and not start with a space'
    }
  },
  last_name: {
    pattern: {
      value: /^[a-zA-Z]+.*$/,
      message: 'Last name should only contain alphabets and not start with a space'
    }
  },
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      message: 'Please enter a valid email address'
    }
  },
  password: {
    required: 'Password is required',
    minLength: {
      value: 8,
      message: 'Password must be at least 8 characters long'
    },
    pattern: {
      value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    }
  },
  confirmPassword: {
    required: 'Please confirm your password',
    validate: {
      matchesPassword: (value, { password }) => value === password || 'Passwords do not match'
    }
  }
};

export default function RegisterPage() {
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    mode: 'onChange'
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      showErrorToast(error);
      console.log('Registration error:', error);
    }
  }, [error]);

  const onSubmit = async (data) => {
    try {
      const response = await dispatch(registerUser(data)).unwrap();
      showSuccessToast('Registration successful! Please login to continue.');
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex">
      {/* Left Column - Brand */}
      <div className="hidden md:flex md:w-1/2 flex-col items-center justify-center p-8 text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-cream mb-4 cursor-pointer" onClick={()=>navigate('/')}>Postify</h1>
          <p className="text-xl text-cream/90 mb-6">
          Create your account and start sharing what matters to you.
          </p>
          
        </div>
      </div>
      
      {/* Right Column - Registration Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-cream rounded-lg shadow-2xl p-8">
          {/* Mobile only brand display */}
          <div className="text-center mb-6 md:hidden">
            <h1 className="text-3xl font-bold text-black cursor-pointer" onClick={()=>navigate('/')}>Postify</h1>
            <p className="text-black/70 mt-2">Where words come alive</p>
          </div>
          
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-black">Create Account</h1>
            <p className="text-black/70 mt-2">Join Postify to share your stories</p>
          </div>
          
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-5">
              <label htmlFor="username" className="block text-sm font-medium text-black mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                {...register('username', userValidationRules.username)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.username ? 'border-red-500' : 'border-gray-300'
                } focus:ring-black bg-cream-50`}
              />
              {errors.username && (
                <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="block text-sm font-medium text-black mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                {...register('email', userValidationRules.email)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-black bg-cream-50`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="mb-5">
              <label htmlFor="password" className="block text-sm font-medium text-black mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                {...register('password', userValidationRules.password)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-black bg-cream-50`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-black mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                {...register('confirm_password', userValidationRules.confirmPassword)}
                className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.confirm_password ? 'border-red-500' : 'border-gray-300'
                } focus:ring-black bg-cream-50`}
              />
              {errors.confirm_password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.confirm_password.message || errors.confirm_password.matchesPassword?.message}
                </p>
              )}
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>

            <div className="mt-6 text-center">
              <p className="text-black/70">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-black font-medium hover:underline"
                >
                  Login
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}