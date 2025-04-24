import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Layers, Eye } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import CreateEditBlogModal from '../../components/CreateEditBlogModal';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCurrentUserBlogs, 
  deleteBlog,
  markBlogAsRead,
  toggleBlogLike,
  addComment,
  deleteComment,
} from '../../redux/slices/blogSlice';
import ConfirmDialog from '../../components/ConfirmDialog';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';
import LoadingSpinner from '../../components/Loading';

const UserOwnedBlogs = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentBlogToEdit, setCurrentBlogToEdit] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [blogIdToDelete, setBlogIdToDelete] = useState(null);
  const dispatch = useDispatch();
  const { currentUserBlogs, loading, error } = useSelector((state) => state.blogs);


  useEffect(() => {
    dispatch(fetchCurrentUserBlogs());
  }, [dispatch]);

  const handleDeleteBlog = async (blogId) => {
    setBlogIdToDelete(blogId);
    setShowDeleteDialog(true);
  };

  const confirmDeleteBlog = async () => {
    if(blogIdToDelete) {
        try{
            await dispatch(deleteBlog(blogIdToDelete)).unwrap();
            showSuccessToast('Blog deleted successfully!');
        } catch(error){
            console.error('Error deleting blog:', error);
            showErrorToast('Failed to delete blog. Please try again.');
        }
    }
    setShowDeleteDialog(false);
  };

  const handleEditBlog = (blogId) => {
    const blogToEdit = currentUserBlogs.find((blog) => blog.id === blogId);
    if (blogToEdit) {
      
      const formattedBlog = {
        ...blogToEdit,
        images: [blogToEdit.image_1, blogToEdit.image_2, blogToEdit.image_3].filter(Boolean),
      };
      setCurrentBlogToEdit(formattedBlog);
      setShowModal(true);
    }
  };

  const handleCreateBlog = () => {
    setCurrentBlogToEdit(null);
    setShowModal(true);
  };

  const handleSaveBlog = () => {
    
    dispatch(fetchCurrentUserBlogs());
    setShowModal(false);
    setCurrentBlogToEdit(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBlogToEdit(null);
  };

  
  const handleReadCountIncremented = async (blogId) => {
    try {
      await dispatch(markBlogAsRead(blogId)).unwrap();
    } catch (error) {
      console.error('Error incrementing read count:', error);
      showErrorToast('Failed to increment read count. Please try again.');
    }
  };
  
  
  const handleLikeToggle = async (blogId) => {
    try {
      await dispatch(toggleBlogLike(blogId)).unwrap();
    } catch (error) {
      console.error('Error toggling like:', error);
      showErrorToast('Failed to update like. Please try again.');
    }
  };
  
  
  const handleCommentSubmit = async (blogId, commentText, parentCommentId=null) => {
    try {
      await dispatch(addComment({ blogId, text: commentText, parentCommentId })).unwrap();
      showSuccessToast('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      showErrorToast('Failed to add comment. Please try again.');
    }
  };
  
  
  const handleDeleteComment = async (blogId, commentId) => {
    try {
      await dispatch(deleteComment({blogId, commentId})).unwrap();
      showSuccessToast('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showErrorToast('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 bg-cream min-h-screen">
      {/* Enhanced Header Section */}
      <div className="mb-8 border-b border-primary/20 pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-primary">My Blogs</h1>
            <p className="text-primary/70 mt-2">
              Manage and explore your published content
            </p>
          </div>
          <button
            onClick={handleCreateBlog}
            className="hidden md:flex items-center bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition shadow-md"
          >
            <Plus size={18} className="mr-2" />
            New Blog
          </button>
        </div>
        
        {/* Stats summary */}
        {!loading && !error && currentUserBlogs.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
              <Layers size={20} className="text-primary mr-3" />
              <div>
                <p className="text-xs text-gray-500">Total Blogs</p>
                <p className="text-xl font-bold text-primary">{currentUserBlogs.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm flex items-center">
              <Calendar size={20} className="text-primary mr-3" />
              <div>
                <p className="text-xs text-gray-500">Latest Post</p>
                <p className="text-sm font-medium text-gray-700 truncate">
                  {currentUserBlogs.length > 0 ? new Date(
                    Math.max(...currentUserBlogs.map(b => new Date(b.created_at)))
                  ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '-'}
                </p>
              </div>
            </div>
            <div className="hidden md:flex bg-white rounded-lg p-4 shadow-sm items-center">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 mr-3">
                <Eye size={16} className="text-green-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Views</p>
                <p className="text-xl font-bold text-primary">
                  {currentUserBlogs.reduce((sum, blog) => sum + blog.read_count, 0)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading your blogs...</p>
        </div>
      ) : error ? (
        <div className="text-center py-16 bg-red-50 rounded-lg border border-red-100">
          <p className="text-lg text-red-600 mb-4">Failed to load blogs: {error}</p>
          <button
            onClick={() => dispatch(fetchCurrentUserBlogs())}
            className="bg-primary text-white px-6 py-2 rounded-lg shadow hover:bg-primary/90 transition"
          >
            Retry
          </button>
        </div>
      ) : currentUserBlogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white/50 rounded-xl shadow-sm">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Plus size={32} className="text-primary" />
          </div>
          <p className="text-xl font-medium text-gray-700 mb-3">You haven't created any blogs yet</p>
          <p className="text-gray-500 mb-6 text-center max-w-md">Share your thoughts, stories, and experiences with the world by creating your first blog post.</p>
          <button
            onClick={handleCreateBlog}
            className="bg-primary text-white px-6 py-3 rounded-lg flex items-center shadow-md hover:shadow-lg transition"
          >
            <Plus size={18} className="mr-2" />
            Create Your First Blog
          </button>
        </div>
      ) : (
        <>
          {/* Blog Grid */}
          <div className="grid gap-8 md:grid-cols-2">
            {currentUserBlogs.map((blog) => (
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
                isMyBlog={true}
                onDelete={handleDeleteBlog}
                onEdit={handleEditBlog}
                onReadCountIncremented={handleReadCountIncremented}
                onLikeToggle={handleLikeToggle}
                onCommentSubmit={handleCommentSubmit}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>

          {/* Create blog button (fixed position) - mobile only */}
          <button
            onClick={handleCreateBlog}
            className="md:hidden fixed bottom-8 right-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
            style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}
          >
            <Plus size={24} />
          </button>
        </>
      )}

      {/* Create/Edit Blog Modal */}
      <CreateEditBlogModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSave={handleSaveBlog}
        blogToEdit={currentBlogToEdit}
      />
      
      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDeleteBlog}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonColor="danger"
        size="medium"
      />
    </div>
  );
};

export default UserOwnedBlogs;