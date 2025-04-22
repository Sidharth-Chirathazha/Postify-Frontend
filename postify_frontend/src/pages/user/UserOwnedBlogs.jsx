import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import BlogCard from '../../components/BlogCard';
import CreateEditBlogModal from '../../components/CreateEditBlogModal';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchCurrentUserBlogs, 
  deleteBlog, 

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

  // Fetch blogs on component mount
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
      // Map images to the format expected by CreateEditBlogModal
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
    // After saving, refetch blogs to update the list
    dispatch(fetchCurrentUserBlogs());
    setShowModal(false);
    setCurrentBlogToEdit(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentBlogToEdit(null);
  };

  // Handler for read count incrementation
  const handleReadCountIncremented = async (blogId) => {
    try {
      // In a real implementation, you'd make an API call to increment the read count
      console.log(`Incrementing read count for blog ID: ${blogId}`);
      
      // Sample implementation (you'd need to create this action in your Redux slice)
      // await dispatch(incrementReadCount(blogId)).unwrap();
      
      // For this example, we'll just log the action
      // In a real app, you might want to update the UI to reflect the new count
    } catch (error) {
      console.error('Error incrementing read count:', error);
    }
  };
  
  // Handler for toggling a blog like
  const handleLikeToggle = async (blogId) => {
    try {
      await dispatch(toggleLikeBlog(blogId)).unwrap();
      // The blog state will be updated automatically by the reducer
    } catch (error) {
      console.error('Error toggling like:', error);
      showErrorToast('Failed to update like. Please try again.');
    }
  };
  
  // Handler for adding a comment
  const handleCommentSubmit = async (blogId, commentText) => {
    try {
      await dispatch(addComment({ blogId, text: commentText })).unwrap();
      showSuccessToast('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      showErrorToast('Failed to add comment. Please try again.');
    }
  };
  
  // Handler for deleting a comment
  const handleDeleteComment = async (commentId, blogId) => {
    try {
      await dispatch(deleteComment({ commentId, blogId })).unwrap();
      showSuccessToast('Comment deleted successfully!');
    } catch (error) {
      console.error('Error deleting comment:', error);
      showErrorToast('Failed to delete comment. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-cream min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary">My Blogs</h1>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-600 mb-4">Failed to load blogs: {error}</p>
          <button
            onClick={() => dispatch(fetchCurrentUserBlogs())}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : currentUserBlogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">You haven't created any blogs yet.</p>
          <button
            onClick={handleCreateBlog}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center mx-auto"
          >
            <Plus size={18} className="mr-1" />
            Create Your First Blog
          </button>
        </div>
      ) : (
        <>
          <div className="space-y-6">
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

          {/* Create blog button (fixed position) */}
          <button
            onClick={handleCreateBlog}
            className="fixed bottom-8 left-8 bg-primary text-white p-4 rounded-full shadow-lg hover:bg-gray-800 transition-colors"
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