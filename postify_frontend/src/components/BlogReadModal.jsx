import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, Eye, Reply, Trash2, ChevronLeft, ChevronRight, Send, AlertTriangle, CheckCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const BlogReadModal = ({ 
  blog, 
  isOpen, 
  onClose,
  isAdmin = false, 
  onReadCountIncremented = () => {}, 
  onLikeToggle = () => {},
  onCommentSubmit = () => {},
  onDeleteComment = () => {},
  onToggleCommentStatus = () => {}
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReadCounted, setIsReadCounted] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { user } = useSelector((state) => state.auth);
  
  
  useEffect(() => {
    if (isOpen && !isReadCounted && blog?.id && !isAdmin) {
      onReadCountIncremented(blog.id);
      setIsReadCounted(true);
    }
  }, [isOpen, isReadCounted, blog?.id, onReadCountIncremented, isAdmin]);

  
  useEffect(() => {
    if (!isOpen) {
      setIsReadCounted(false);
      setCommentText('');
    }
  }, [isOpen]);

  const handleNextImage = () => {
    if (blog?.images?.length > 1) {
      setActiveImageIndex((prev) => (prev === blog.images.length - 1 ? 0 : prev + 1));
    }
  };

  const handlePrevImage = () => {
    if (blog?.images?.length > 1) {
      setActiveImageIndex((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
    }
  };
  
  const handleLikeToggle = () => {
    if (blog?.id && !isAdmin) {
      onLikeToggle(blog.id);
    }
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim() || isAdmin) return;
    
    onCommentSubmit(blog.id, commentText);
    setCommentText('');
  };

  
  const getImages = () => {
    if (!blog) return [];
    const images = [];
    if (blog.image_1) images.push(blog.image_1);
    if (blog.image_2) images.push(blog.image_2);
    if (blog.image_3) images.push(blog.image_3);
    return images;
  };

  
  const getParentComments = () => {
    if (!blog?.comments) return [];
    return blog.comments.filter(comment => !comment.parent_comment);
  };

  if (!isOpen || !blog) return null;

  const images = getImages();
  const parentComments = getParentComments();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header  */}
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
          <div className="flex items-center">
            <img 
              src={blog.author.profile_pic} 
              alt={blog.author.username} 
              className="w-9 h-9 rounded-full object-cover mr-3 border-2 border-white/30 shadow-sm"
            />
            <div>
              <p className="font-medium text-white">{blog.author.username}</p>
              <p className="text-gray-300 text-xs">
                {dayjs(blog.created_at).fromNow()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-300 hover:text-white p-1 transition-colors rounded-full hover:bg-black/20"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Two-column layout: Post content + Comments */}
        <div className="flex flex-col md:flex-row h-[calc(90vh-3.5rem)] overflow-hidden">
          {/* Left column - Post content */}
          <div className="w-full md:w-3/5 overflow-y-auto border-r border-gray-100 flex flex-col bg-cream">
            {/* Blog title */}
            <h2 className="text-xl sm:text-2xl font-bold px-4 sm:px-5 pt-4 pb-2 text-gray-800">{blog.title}</h2>
            
            {/* Images carousel */}
            {images.length > 0 && (
              <div className="relative bg-gray-50">
                <div className="h-52 sm:h-64 md:h-72">
                  <img 
                    src={images[activeImageIndex]} 
                    alt={`Blog image ${activeImageIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                {images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-1.5 rounded-full hover:bg-opacity-80 transition-opacity shadow-md"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 text-white p-1.5 rounded-full hover:bg-opacity-80 transition-opacity shadow-md"
                      aria-label="Next image"
                    >
                      <ChevronRight size={18} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1.5">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-1.5 h-1.5 rounded-full transition-colors ${
                            index === activeImageIndex ? 'bg-white' : 'bg-white/40'
                          }`}
                          aria-label={`Go to image ${index + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
            
            {/* Full blog content */}
            <div className="px-4 sm:px-5 py-4 flex-grow text-gray-700">
              <p className="whitespace-pre-line">{blog.content}</p>
            </div>
            
            {/* Footer Stats with like button */}
            <div className="flex items-center justify-between text-white bg-gray-900 p-3 mt-auto">
              <div className="flex items-center space-x-5">
                <button 
                  className={`flex items-center space-x-1.5 transition-colors ${
                    isAdmin ? 'text-gray-400 cursor-not-allowed' : 'hover:text-gray-300'
                  }`}
                  onClick={handleLikeToggle}
                  disabled={isAdmin}
                  aria-label={blog.is_liked ? "Unlike" : "Like"}
                >
                  <Heart 
                    size={16} 
                    className={blog.is_liked && !isAdmin ? "text-red-400 fill-red-400" : ""} 
                  />
                  <span className="text-sm">{blog.like_count}</span>
                </button>
                <div className="flex items-center space-x-1.5">
                  <MessageCircle size={16} />
                  <span className="text-sm">{blog.comments?.length || 0}</span>
                </div>
              </div>
              <div className="flex items-center space-x-1.5 text-gray-300">
                <Eye size={16} />
                <span className="text-sm">{blog.read_count} Views</span>
              </div>
            </div>
          </div>
          
          {/* Right column - Comments */}
          <div className="w-full md:w-2/5 flex flex-col h-full bg-white">
            <div className="p-3 border-b border-gray-200 bg-gray-900 text-white">
              <h3 className="font-medium text-base">Comments ({blog.comments?.length || 0})</h3>
              {isAdmin && (
                <p className="text-xs text-gray-300 mt-0.5">
                  Admin mode: You can block/unblock comments
                </p>
              )}
            </div>
            
            {/* Comments list */}
            <div className="flex-grow overflow-y-auto p-3">
              {parentComments.length > 0 ? (
                <div className="space-y-3">
                  {parentComments.map((comment) => (
                    <Comment 
                      key={comment.id} 
                      comment={comment} 
                      blogId={blog.id}
                      onDeleteComment={isAdmin ? null : onDeleteComment}
                      onToggleCommentStatus={isAdmin ? onToggleCommentStatus : null}
                      onCommentSubmit={onCommentSubmit} 
                      user={user}
                      isAdmin={isAdmin}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageCircle size={32} className="mb-2" />
                  <p className="text-sm">No comments yet.</p>
                </div>
              )}
            </div>
            
            {/* Comment input - only shown for non-admin users */}
            {!isAdmin && (
              <div className="p-3 border-t border-gray-200 bg-gray-50">
                <form onSubmit={handleCommentSubmit} className="flex items-center">
                  <img 
                    src={user?.profile_pic} 
                    alt={user?.username} 
                    className="w-7 h-7 rounded-full object-cover mr-2 border border-gray-300"
                  />
                  <div className="flex-grow relative">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      className="w-full border border-gray-300 rounded-full pl-3 pr-10 py-1.5 focus:outline-none focus:ring-1 focus:ring-gray-500 bg-white text-gray-700 placeholder-gray-400 text-sm min-h-8 max-h-16 resize-none"
                      rows={1}
                    />
                    <button 
                      type="submit" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition-colors"
                      disabled={!commentText.trim()}
                    >
                      <Send size={16} />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const Comment = ({ 
  comment, 
  blogId, 
  onDeleteComment, 
  onToggleCommentStatus,
  onCommentSubmit, 
  user,
  isAdmin 
}) => {
  const userId = user?.id;
  
  
  const [showReplies, setShowReplies] = useState(false);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const isCommentOwner = userId === comment.user.id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  const handleDeleteComment = () => {
    if (onDeleteComment) {
      onDeleteComment(blogId, comment.id);
    }
  };
  
  const handleToggleCommentStatus = () => {
    if (onToggleCommentStatus) {
      onToggleCommentStatus(comment.id);
    }
  };
  
  const handleReplySubmit = (e) => {
    e.preventDefault();
    
    if (!replyText.trim() || isAdmin) return;
    
    onCommentSubmit(blogId, replyText, comment.id);
    
    setReplyText('');
    setIsReplying(false);
    setShowReplies(true);
  };

  const getCommentStyles = () => {
    if (isAdmin && comment.is_active === false) {
      return "bg-red-50 border-red-100";
    }
    return "bg-gray-50 border-gray-100 hover:border-gray-200";
  };
  
  return (
    <div className={`rounded-lg overflow-hidden shadow-sm border transition-colors ${getCommentStyles()}`}>
      <div className="p-2.5">
        <div className="flex items-start">
          <img 
            src={comment.user.profile_pic} 
            alt={comment.user.username} 
            className="w-7 h-7 rounded-full object-cover mr-2 mt-0.5 border border-gray-200"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <h4 className="font-medium text-gray-800 text-sm">{comment.user.username}</h4>
                {isAdmin && comment.is_active === false && (
                  <span className="ml-1.5 bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full text-xs">
                    Blocked
                  </span>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {dayjs(comment.created_at).fromNow()}
              </span>
            </div>
            <p className={`mt-0.5 text-sm ${isAdmin && comment.is_active === false ? 'text-gray-400' : 'text-gray-700'}`}>
              {comment.content}
            </p>
            
            <div className="flex items-center mt-1.5 space-x-3 text-xs">
              {!isAdmin && (
                <button 
                  onClick={() => setIsReplying(!isReplying)}
                  className="text-gray-600 hover:text-gray-800 flex items-center transition-colors font-medium"
                >
                  <Reply size={11} className="mr-1" />
                  Reply
                </button>
              )}
              
              {isAdmin ? (
                <button 
                  onClick={handleToggleCommentStatus}
                  className={`flex items-center transition-colors font-medium ${
                    comment.is_active === false 
                      ? "text-green-600 hover:text-green-700" 
                      : "text-red-500 hover:text-red-700"
                  }`}
                >
                  {comment.is_active === false ? (
                    <>
                      <CheckCircle size={11} className="mr-1" />
                      Unblock
                    </>
                  ) : (
                    <>
                      <AlertTriangle size={11} className="mr-1" />
                      Block
                    </>
                  )}
                </button>
              ) : isCommentOwner && (
                <button 
                  onClick={handleDeleteComment}
                  className="text-red-500 hover:text-red-700 flex items-center transition-colors font-medium"
                >
                  <Trash2 size={11} className="mr-1" />
                  Delete
                </button>
              )}
              
              {hasReplies && (
                <button 
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-gray-600 hover:text-gray-800 font-medium ml-auto"
                >
                  {showReplies ? `Hide replies (${comment.replies.length})` : `Show replies (${comment.replies.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Reply form - only visible for non-admin users */}
        {isReplying && !isAdmin && (
          <div className="mt-2 pl-9">
            <form onSubmit={handleReplySubmit} className="flex items-center">
              <img 
                src={user?.profile_pic} 
                alt={user?.username} 
                className="w-5 h-5 rounded-full object-cover mr-1.5 border border-gray-200"
              />
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user.username}...`}
                  className="w-full border border-gray-200 rounded-full pl-2.5 pr-16 py-1 focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white text-gray-700 placeholder-gray-400 text-xs"
                  autoFocus
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                  <button 
                    type="button" 
                    onClick={() => setIsReplying(false)}
                    className="text-gray-500 text-xs px-1.5 py-0.5 hover:bg-gray-100 transition-colors rounded-full mr-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-gray-800 text-white text-xs px-1.5 py-0.5 rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50"
                    disabled={!replyText.trim()}
                  >
                    Reply
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
      
      {/* Nested replies*/}
      {hasReplies && showReplies && (
        <div className="pl-8 pr-2.5 pb-2.5 space-y-2 border-l border-gray-200 ml-7">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              blogId={blogId} 
              onDeleteComment={onDeleteComment}
              onToggleCommentStatus={onToggleCommentStatus}
              onCommentSubmit={onCommentSubmit}
              user={user}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogReadModal;