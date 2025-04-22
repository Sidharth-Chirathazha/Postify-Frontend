import React, { useEffect, useState } from 'react';
import { X, Heart, MessageCircle, Eye, Reply, Trash2, ChevronLeft, ChevronRight, Send } from 'lucide-react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const BlogReadModal = ({ 
  blog, 
  isOpen, 
  onClose, 
  onReadCountIncremented = () => {}, 
  onLikeToggle = () => {},
  onCommentSubmit = () => {},
  onDeleteComment = () => {}
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReadCounted, setIsReadCounted] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { user } = useSelector((state) => state.auth);
  
  // Handle reading count increment - only once per modal open
  useEffect(() => {
    if (isOpen && !isReadCounted && blog?.id) {
      onReadCountIncremented(blog.id);
      setIsReadCounted(true);
    }
  }, [isOpen, isReadCounted, blog?.id, onReadCountIncremented]);

  // Reset read counted state when modal closes
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
    if (blog?.id) {
      onLikeToggle(blog.id);
    }
  };
  
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    
    onCommentSubmit(blog.id, commentText);
    setCommentText('');
  };

  // Process images from blog data
  const getImages = () => {
    if (!blog) return [];
    const images = [];
    if (blog.image_1) images.push(blog.image_1);
    if (blog.image_2) images.push(blog.image_2);
    if (blog.image_3) images.push(blog.image_3);
    return images;
  };

  // Filter only parent comments (no parent_comment)
  const getParentComments = () => {
    if (!blog?.comments) return [];
    return blog.comments.filter(comment => !comment.parent_comment);
  };

  if (!isOpen || !blog) return null;

  const images = getImages();
  const parentComments = getParentComments();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-cream rounded-lg shadow-xl overflow-hidden w-full max-w-5xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-primary border-b border-cream/20">
          <div className="flex items-center">
            <img 
              src={blog.author.profile_pic} 
              alt={blog.author.username} 
              className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-cream"
            />
            <div>
              <p className="font-medium text-cream">{blog.author.username}</p>
              <p className="text-cream/70 text-sm">
                {dayjs(blog.created_at).fromNow()}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-cream/70 hover:text-cream p-1 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Two-column layout: Post content + Comments */}
        <div className="flex h-[calc(90vh-4rem)] overflow-hidden">
          {/* Left column - Post content */}
          <div className="w-3/5 overflow-y-auto border-r border-primary/10 flex flex-col bg-cream">
            {/* Blog title */}
            <h2 className="text-2xl font-bold px-6 pt-5 pb-3 text-primary">{blog.title}</h2>
            
            {/* Images carousel */}
            {images.length > 0 && (
              <div className="relative">
                <div className="h-80 bg-cream/50">
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
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-primary bg-opacity-75 text-cream p-2 rounded-full hover:bg-opacity-90 transition-opacity"
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary bg-opacity-75 text-cream p-2 rounded-full hover:bg-opacity-90 transition-opacity"
                      aria-label="Next image"
                    >
                      <ChevronRight size={20} />
                    </button>
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                      {images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setActiveImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-colors ${
                            index === activeImageIndex ? 'bg-primary' : 'bg-primary/40'
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
            <div className="px-6 py-6 flex-grow">
              <p className="text-primary whitespace-pre-line">{blog.content}</p>
            </div>
            
            {/* Footer Stats with like button */}
            <div className="flex items-center justify-between text-cream bg-primary p-4 mt-auto">
              <div className="flex items-center space-x-6">
                <button 
                  className="flex items-center space-x-2 hover:text-cream/80 transition-colors"
                  onClick={handleLikeToggle}
                  aria-label={blog.is_liked ? "Unlike" : "Like"}
                >
                  <Heart 
                    size={18} 
                    className={blog.is_liked ? "text-red-400 fill-red-400" : ""} 
                  />
                  <span>{blog.like_count}</span>
                </button>
                <div className="flex items-center space-x-2">
                  <MessageCircle size={18} />
                  <span>{blog.comments?.length || 0}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Eye size={18} />
                <span>{blog.read_count} Views</span>
              </div>
            </div>
          </div>
          
          {/* Right column - Comments */}
          <div className="w-2/5 flex flex-col h-full bg-cream">
            <div className="p-4 border-b border-primary/10 bg-primary text-cream">
              <h3 className="font-medium text-lg">Comments ({blog.comments?.length || 0})</h3>
            </div>
            
            {/* Comments list */}
            <div className="flex-grow overflow-y-auto px-4 py-4">
              {parentComments.length > 0 ? (
                <div className="space-y-4">
                  {parentComments.map((comment) => (
                    <Comment 
                      key={comment.id} 
                      comment={comment} 
                      blogId={blog.id}
                      onDeleteComment={onDeleteComment}
                      onCommentSubmit={onCommentSubmit} 
                      user={user}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-primary/60">
                  <MessageCircle size={40} className="mb-2" />
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              )}
            </div>
            
            {/* Comment input */}
            <div className="p-4 border-t border-primary/10 bg-primary text-cream">
              <form onSubmit={handleCommentSubmit} className="flex items-center">
                <img 
                  src={user?.profile_pic} 
                  alt={user?.username} 
                  className="w-8 h-8 rounded-full object-cover mr-2 border border-cream/30"
                />
                <div className="flex-grow relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    className="w-full border border-cream/30 rounded-full pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-cream/50 bg-primary/80 text-cream placeholder-cream/50 text-sm min-h-8 max-h-20 resize-none"
                    rows={1}
                  />
                  <button 
                    type="submit" 
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-cream hover:text-cream/80 disabled:text-cream/30 transition-colors"
                    disabled={!commentText.trim()}
                  >
                    <Send size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Comment component
const Comment = ({ comment, blogId, onDeleteComment, onCommentSubmit, user }) => {
  const userId = user?.id;
  
  const [showReplies, setShowReplies] = useState(true);
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');
  
  const isCommentOwner = userId === comment.user.id;
  const hasReplies = comment.replies && comment.replies.length > 0;
  
  const handleDeleteComment = () => {
    if (onDeleteComment) {
      onDeleteComment(blogId, comment.id);
    }
  };
  
  const handleReplySubmit = (e) => {
    e.preventDefault();
    
    if (!replyText.trim()) return;
    
    // Add parent_comment_id to indicate this is a reply
    onCommentSubmit(blogId, replyText, comment.id);
    
    // Reset form
    setReplyText('');
    setIsReplying(false);
    setShowReplies(true);
  };
  
  return (
    <div className="bg-primary/5 rounded-lg overflow-hidden shadow-sm border border-primary/10 hover:border-primary/20 transition-colors">
      <div className="p-3">
        <div className="flex items-start">
          <img 
            src={comment.user.profile_pic} 
            alt={comment.user.username} 
            className="w-8 h-8 rounded-full object-cover mr-2 mt-1 border border-primary/20"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-primary">{comment.user.username}</h4>
              <span className="text-xs text-primary/60">
                {dayjs(comment.created_at).fromNow()}
              </span>
            </div>
            <p className="text-primary mt-1 text-sm">{comment.content}</p>
            
            <div className="flex items-center mt-2 space-x-4 text-xs">
              <button 
                onClick={() => setIsReplying(!isReplying)}
                className="text-primary/80 hover:text-primary flex items-center transition-colors font-medium"
              >
                <Reply size={12} className="mr-1" />
                Reply
              </button>
              
              {isCommentOwner && (
                <button 
                  onClick={handleDeleteComment}
                  className="text-red-500 hover:text-red-700 flex items-center transition-colors font-medium"
                >
                  <Trash2 size={12} className="mr-1" />
                  Delete
                </button>
              )}
              
              {hasReplies && (
                <button 
                  onClick={() => setShowReplies(!showReplies)}
                  className="text-primary/80 hover:text-primary font-medium ml-auto"
                >
                  {showReplies ? `Hide replies (${comment.replies.length})` : `Show replies (${comment.replies.length})`}
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Reply form */}
        {isReplying && (
          <div className="mt-3 pl-10">
            <form onSubmit={handleReplySubmit} className="flex items-center">
              <img 
                src={user?.profile_pic} 
                alt={user?.username} 
                className="w-6 h-6 rounded-full object-cover mr-2 border border-primary/20"
              />
              <div className="flex-grow relative">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.user.username}...`}
                  className="w-full border border-primary/20 rounded-full pl-3 pr-16 py-1 focus:outline-none focus:ring-1 focus:ring-primary/30 bg-cream text-primary placeholder-primary/50 text-sm"
                  autoFocus
                />
                <div className="absolute right-1 top-1/2 -translate-y-1/2 flex">
                  <button 
                    type="button" 
                    onClick={() => setIsReplying(false)}
                    className="text-primary/60 text-xs px-2 py-0.5 hover:bg-primary/5 transition-colors rounded-full mr-1"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-primary text-cream text-xs px-2 py-0.5 rounded-full hover:bg-primary/80 transition-colors disabled:opacity-50"
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
      
      {/* Nested replies */}
      {hasReplies && showReplies && (
        <div className="pl-10 pr-3 pb-3 space-y-2 border-l-2 border-primary/10 ml-8">
          {comment.replies.map((reply) => (
            <Comment 
              key={reply.id} 
              comment={reply} 
              blogId={blogId} 
              onDeleteComment={onDeleteComment}
              onCommentSubmit={onCommentSubmit}
              user={user}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogReadModal;