import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, RefreshCw } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';
import LoadingSpinner from '../../components/Loading';
import { fetchAdminBlogs, toggleBlogStatus, toggleCommentStatus } from '../../redux/slices/adminSlice';

const AdminBlogs = () => {
  const dispatch = useDispatch();
  const { adminBlogs, loading, error, next } = useSelector((state) => state.admin);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);




  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    
    return () => clearTimeout(timerId);
  }, [searchTerm]);

  useEffect(() => {
    fetchBlogData();
  }, [debouncedSearchTerm, activeFilter]);

  const fetchBlogData = () => {
    let isActiveParam = '';
    if (activeFilter === 'active') isActiveParam = true;
    if (activeFilter === 'blocked') isActiveParam = false;
    dispatch(fetchAdminBlogs({
      search: debouncedSearchTerm,
      isActive: isActiveParam
    }));
  };



  const handleLoadMore = () => {
    if (next) {
      const urlObj = new URL(next);
      const relativeUrl = urlObj.pathname + urlObj.search;
      dispatch(fetchAdminBlogs({ url: relativeUrl }));
    }
  };

  
  

  const handleToggleCommentStatus = async (commentId) => {
    try {
      await dispatch(toggleCommentStatus(commentId)).unwrap();
      showSuccessToast('Comment status updated successfully!');
    } catch (error) {
      console.error('Error updating comment status:', error);
      showErrorToast('Failed update comment status. Please try again.');
    }
  };

  const handleToggleBlogStatus = async (blogId) => {
    try {
        
      await dispatch(toggleBlogStatus(blogId)).unwrap();
      showSuccessToast('Blog status updated successfully!');
    } catch (error) {
      console.error('Error updating blog status:', error);
      showErrorToast('Failed update blog status. Please try again.');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    

  };

  const setFilter = (filter) => {
    setActiveFilter(filter);
    setShowFilters(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-cream min-h-screen">
      {/* Enhanced Header with Search Bar */}
      <div className="mb-8 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary flex items-center">
              <Compass className="mr-3 text-primary hidden md:inline" />
              Manage Blogs
            </h1>
            <p className="text-primary/70 mt-2">
            Review, publish, or deactivate blogs to ensure quality and community guidelines are maintained.
            </p>
          </div>
          
          <form onSubmit={handleSearch} className="relative flex-shrink-0 w-full md:w-64">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
            />
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </form>
        </div>
        
        {/* Filters Section */}
        <div className="bg-white p-3 rounded-lg shadow-sm flex items-center justify-between mb-6">
          <div className="hidden md:flex space-x-1">
            <button 
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-md transition ${
                activeFilter === 'all' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              All Blogs
            </button>
            <button 
              onClick={() => setFilter('active')}
              className={`px-4 py-1.5 rounded-md transition ${
                activeFilter === 'active' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Active Blogs
            </button>
            <button 
              onClick={() => setFilter('blocked')}
              className={`px-4 py-1.5 rounded-md transition ${
                activeFilter === 'blocked' 
                  ? 'bg-primary text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              Blocked Blogs
            </button>
          </div>
          
          {/* Mobile Filters Dropdown */}
          <div className="md:hidden relative w-full">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-200 rounded-md"
            >
              <span className="flex items-center">
                <Filter size={16} className="mr-2 text-primary" />
                {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
              </span>
              <span>▼</span>
            </button>
            
            {showFilters && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <button 
                  onClick={() => setFilter('all')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  All Blogs
                </button>
                <button 
                  onClick={() => setFilter('active')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Active Blogs
                </button>
                <button 
                  onClick={() => setFilter('blocked')}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Blocked Blogs
                </button>
              </div>
            )}
          </div>
          
          <p className="hidden md:block text-sm text-gray-500">
            {adminBlogs.length} blogs found
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading && !adminBlogs.length ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Discovering amazing blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100">
          <p className="text-lg text-red-600 mb-4">Failed to load blogs: {error}</p>
          <button
            onClick={() => dispatch(fetchAdminBlogs())}
            className="bg-primary text-white px-6 py-2 rounded-lg shadow-md hover:bg-primary/90 transition flex items-center mx-auto"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      ) : adminBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Compass size={32} className="text-primary" />
          </div>
          <p className="text-xl font-medium text-gray-700 mb-3">No blogs found</p>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            Be the first to share your thoughts and experiences with the community!
          </p>
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {adminBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                blog={{
                  ...blog,
                  images: [blog.image_1, blog.image_2, blog.image_3].filter(Boolean),
                  date: new Date(blog.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }),
                  likeCount: blog.like_count,
                  isLiked: blog.is_liked,
                  readCount: blog.read_count,
                }}
                isAdmin={true}
                onToggleCommentStatus={handleToggleCommentStatus}
                onToggleBlogStatus={handleToggleBlogStatus}
              />
            ))}
          </div>
        </>
      )}
      
      {/* Load More Button */}
      {next && !loading && (
        <div className="flex justify-center mt-10 mb-4">
          <button
            onClick={handleLoadMore}
            className={`
              px-6 py-3 
              ${loading ? 'bg-gray-300' : 'bg-primary hover:bg-primary/90'} 
              text-white rounded-lg shadow-md transition flex items-center
            `}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Loading...
              </>
            ) : (
              'Load More Blogs'
            )}
          </button>
        </div>
      )}
      
      {/* Loading indicator when loading more posts */}
      {loading && adminBlogs.length > 0 && (
        <div className="flex justify-center my-8">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;