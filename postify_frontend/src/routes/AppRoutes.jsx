import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
    Outlet
  } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import MainLayout from '../components/MainLayout';
import UserLayout from '../components/UserLayout';
import AdminLayout from '../components/AdminLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegistrationPage';
import UserHome from '../pages/user/UserHome';
import AdminHome from '../pages/admin/AdminHome';
import NotFoundPage from '../pages/NotFoundPage';
import { useEffect } from 'react';
import { fetchCurrentUser } from '../redux/slices/authSlice';
import LoadingSpinner from '../components/Loading';
import UserProfile from '../pages/user/UserProfile';
import UserOwnedBlogs from '../pages/user/UserOwnedBlogs';
import ExploreBlogs from '../pages/user/ExploreBlogs';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminBlogs from '../pages/admin/AdminBlogs';
  
  const AppRoutes = () => {
    const {user, loading} = useSelector((state) => state.auth);
    const isAuthenticated = !!user;
    const dispatch = useDispatch();

    useEffect(()=>{
      dispatch(fetchCurrentUser());
    },[dispatch])
    
    const RequireAuth = ({ role }) => {
      if (!isAuthenticated) return <Navigate to="/login" />;
  
      if (role && user.role !== role) {
        return <Navigate to="/" />;
      }
  
      return <Outlet />;
    };

    const RedirectIfAuthenticated = () => {
        if (isAuthenticated) {
          if (user.role === 'user') {
            return <Navigate to="/user/home" replace />;
          } else if (user.role === 'admin') {
            return <Navigate to="/admin/home" replace />;
          }
        }
        return <Outlet />;
      };

    if (loading) {
      return (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      );
    }
      

  
    return (
        <Routes>
          {/* Public */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<HomePage />} />
          </Route>

          <Route element={<RedirectIfAuthenticated />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>
  
          {/* User Routes */}
        <Route element={<RequireAuth role="user" />}>
          <Route element={<UserLayout user={user} />}>
            <Route path="/user/home" element={<UserHome />} />
            <Route path="/user/profile" element={<UserProfile />} />
            <Route path="/user/my-blogs" element={<UserOwnedBlogs />} />
            <Route path="/user/explore" element={<ExploreBlogs />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<RequireAuth role="admin" />}>
          <Route element={<AdminLayout user={user} />}>
            <Route path="/admin/home" element={<AdminHome />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/blogs" element={<AdminBlogs />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
    );
  };
  
  export default AppRoutes;
  