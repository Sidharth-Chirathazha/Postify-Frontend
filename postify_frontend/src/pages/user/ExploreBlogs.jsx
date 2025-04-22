import React, { useState, useEffect } from 'react';
import BlogCard from '../../components/BlogCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, markBlogAsRead, toggleBlogLike, addComment, deleteComment } from '../../redux/slices/blogSlice';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';
import LoadingSpinner from '../../components/Loading';

const ExploreBlogs = () => {
  const dispatch = useDispatch();
  const { blogs, loading, error, next } = useSelector((state) => state.blogs);

  // Fetch blogs on component mount
  useEffect(() => {
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleLoadMore = () => {
    if (next) {
      dispatch(fetchBlogs(next));
    }
  };



  // Handler for read count incrementation
  const handleReadCountIncremented = async (blogId) => {
    try {
      await dispatch(markBlogAsRead(blogId)).unwrap();

    } catch (error) {
      console.error('Error incrementing read count:', error);
      showErrorToast('Failed to increment read count. Please try again.');
    }
  };
  
  // Handler for toggling a blog like
  const handleLikeToggle = async (blogId) => {
    try {
      await dispatch(toggleBlogLike(blogId)).unwrap();
      // The blog state will be updated automatically by the reducer
    } catch (error) {
      console.error('Error toggling like:', error);
      showErrorToast('Failed to update like. Please try again.');
    }
  };
  
  // Handler for adding a comment
  const handleCommentSubmit = async (blogId, commentText, parentCommentId=null) => {
    try {
      await dispatch(addComment({ blogId, content: commentText, parentCommentId })).unwrap();
      showSuccessToast('Comment added successfully!');
    } catch (error) {
      console.error('Error adding comment:', error);
      showErrorToast('Failed to add comment. Please try again.');
    }
  };
  
  // Handler for deleting a comment
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
    <div className="max-w-3xl mx-auto p-4 bg-cream min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary">Explore Blogs</h1>

      {loading ? (
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-lg text-red-600 mb-4">Failed to load blogs: {error}</p>
          <button
            onClick={() => dispatch(fetchBlogs())}
            className="bg-primary text-white px-4 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600 mb-4">There are no blogs yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-6">
            {blogs.map((blog) => (
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
                onReadCountIncremented={handleReadCountIncremented}
                onLikeToggle={handleLikeToggle}
                onCommentSubmit={handleCommentSubmit}
                onDeleteComment={handleDeleteComment}
              />
            ))}
          </div>
        </>
      )}
      {next && !loading && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLoadMore}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreBlogs;