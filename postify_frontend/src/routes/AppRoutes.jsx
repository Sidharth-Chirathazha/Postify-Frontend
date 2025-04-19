import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';
import { useSelector } from 'react-redux';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegistrationPage';
import UserDashboard from '../pages/user/UserDashboard';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NotFoundPage from '../pages/NotFoundPage';
  
  const AppRoutes = () => {
    const user = useSelector((state) => state.auth.user);
    const isAuthenticated = !!user;
  
    const RequireAuth = ({ children, role }) => {
      if (!isAuthenticated) return <Navigate to="/login" />;
  
      if (role && user.role !== role) {
        return <Navigate to="/" />;
      }
  
      return children;
    };

    const RedirectIfAuthenticated = ({ children }) => {
        if (isAuthenticated) {
          if (user.role === 'user') {
            return <Navigate to="/user/dashboard" replace />;
          } else if (user.role === 'admin') {
            return <Navigate to="/admin/dashboard" replace />;
          }
        }
        return children;
      };

  
    return (
        <Routes>
          {/* Public */}
          <Route path="/" element={<HomePage />} />

          <Route 
            path="/login" 
            element={
            <RedirectIfAuthenticated>
                <LoginPage />
            </RedirectIfAuthenticated>
            }
          />

          <Route 
            path="/register" 
            element={
                <RedirectIfAuthenticated>
                    <RegisterPage />
                </RedirectIfAuthenticated>
            } 
          />
  
          {/* User Routes */}
        <Route
            element={<RequireAuth role="user" />}
        >
            <Route path="/user/dashboard" element={<UserDashboard />} />
            {/* Add more user routes here, e.g., <Route path="/user/profile" element={<UserProfile />} /> */}
        </Route>

        {/* Admin Routes */}
        <Route
            element={<RequireAuth role="admin" />}
        >
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {/* Add more admin routes here */}
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    );
  };
  
  export default AppRoutes;
  