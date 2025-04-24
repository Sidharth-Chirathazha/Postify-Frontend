import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const AdminHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0
  });
  
  useEffect(() => {

    const fetchStats = async () => {
      try {
        const response = await axiosInstance.get('admin/dashboard-stats/');
        const data = response.data;
        setStats({
          totalUsers: data.total_users,
          activeUsers: data.active_users,
          totalPosts: data.total_blogs
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };
    
    fetchStats();
  }, []);


  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 ${color} flex flex-col`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="py-8 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Admin Dashboard</h1>
          <p className="text-primary/70 text-lg">
            Overview of your blog platform's performance and activity
          </p>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Total Users" 
            value={stats.totalUsers} 
            icon="👥" 
            color="border-l-4 border-blue-500"
          />
          <StatCard 
            title="Active Users" 
            value={stats.activeUsers} 
            icon="✅" 
            color="border-l-4 border-green-500"
          />
          <StatCard 
            title="Total Posts" 
            value={stats.totalPosts} 
            icon="📝" 
            color="border-l-4 border-purple-500"
          />
        </div>
        
        {/* Quick Actions Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/admin/users')}
              className="bg-white shadow-md rounded-lg p-6 hover:bg-primary hover:text-cream transition flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-2">👥</span>
              <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
              <p className="text-gray-600 text-sm">View, block, or unblock user accounts</p>
            </button>
            <button
              onClick={() => navigate('/admin/blogs')}
              className="bg-white shadow-md rounded-lg p-6 hover:bg-primary hover:text-cream transition flex flex-col items-center text-center"
            >
              <span className="text-3xl mb-2">📝</span>
              <h3 className="text-xl font-semibold mb-2">Manage Posts</h3>
              <p className="text-gray-600 text-sm">Review, edit, or delete blog posts</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;