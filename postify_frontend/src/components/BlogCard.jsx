import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Trash2, Edit, Calendar, ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import BlogReadModal from './BlogReadModal';

const BlogCard = ({ 
  blog, 
  isMyBlog = false,
  isAdmin = false, 
  onDelete, 
  onEdit, 
  onReadCountIncremented,
  onLikeToggle,
  onCommentSubmit,
  onDeleteComment,
  onToggleCommentStatus,
  onToggleBlogStatus
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === blog.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
  };
  
  const handleOpenReadModal = () => {
    setIsReadModalOpen(true);
  };

  const handleCloseReadModal = () => {
    setIsReadModalOpen(false);
  };
  
  const handleEditClick = (e, blogId) => {
    e.stopPropagation();
    onEdit(blogId);
  };
  
  const handleDeleteClick = (e, blogId) => {
    e.stopPropagation();
    onDelete(blogId);
  };

  const toggleReadMore = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };


  const contentPreview = blog.content.substring(0, 80);
  const needsReadMore = blog.content.length > 80;

  return (
    <>
      <div 
        className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 max-w-md border border-gray-100 ${
          isHovered ? 'transform scale-[1.02] shadow-lg border-gray-200' : ''
        }`}
        onClick={handleOpenReadModal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Author and Actions Row */}
        <div className="flex justify-between items-center px-3 py-2.5 border-b border-gray-50">
          <div className="flex items-center">
            <div className="w-7 h-7 rounded-full overflow-hidden ring-2 ring-primary/20 mr-2 flex-shrink-0">
              <img 
                src={blog.author.profile_pic} 
                alt={blog.author.username}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-semibold text-sm text-gray-800">{blog.author.username}</p>
              <div className="flex items-center text-gray-400 text-xs">
                <Calendar size={10} className="mr-1" />
                {blog.date}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center space-x-1" onClick={e => e.stopPropagation()}>
            {isMyBlog && !isAdmin && (
              <>
                <button 
                  onClick={(e) => handleEditClick(e, blog.id)} 
                  className="text-gray-400 hover:text-primary p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Edit blog"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={(e) => handleDeleteClick(e, blog.id)} 
                  className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-gray-50 transition-colors"
                  aria-label="Delete blog"
                >
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {isAdmin && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBlogStatus(blog.id);
                }} 
                className={`p-1.5 rounded-full hover:bg-gray-50 transition-colors ${
                  blog.is_active 
                    ? 'text-gray-400 hover:text-red-500' 
                    : 'text-gray-400 hover:text-green-500'
                }`}
                aria-label={blog.is_active ? 'Block blog' : 'Unblock blog'}
              >
                {blog.is_active ? <Lock size={16} /> : <Unlock size={16} />}
              </button>
            )}
          </div>
        </div>

        {/* Blog Images Carousel  */}
        <div className="relative aspect-[16/9] w-full bg-gray-100">
          <img 
            src={blog.images[activeImageIndex]} 
            alt={`Blog image ${activeImageIndex + 1}`}
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {blog.images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 text-white p-1 rounded-full hover:bg-opacity-40 transition-all shadow-sm flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft size={16} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-20 text-white p-1 rounded-full hover:bg-opacity-40 transition-all shadow-sm flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight size={16} />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex space-x-1">
                {blog.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`h-1 rounded-full transition-all ${
                      index === activeImageIndex ? 'bg-white w-4' : 'bg-white bg-opacity-40 w-1.5'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Blog Title and Content Preview */}
        <div className="px-4 pt-3 pb-2">
          <h2 className="text-base font-bold text-gray-800 line-clamp-1 mb-1">
            {blog.title}
          </h2>
          
          <p className="text-xs text-gray-600 line-clamp-2">
            {isExpanded ? blog.content : contentPreview}
            {needsReadMore && (
              <button 
                onClick={toggleReadMore} 
                className="text-primary font-medium ml-1 text-xs"
              >
                {isExpanded ? "Show less" : "Read more"}
              </button>
            )}
          </p>
        </div>
        
        {/* Engagement Stats*/}
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-50 bg-gray-50/50">
          <div className="flex items-center space-x-5">
            <button 
              className="flex items-center space-x-1.5 group"
              onClick={(e) => {
                e.stopPropagation();
                onLikeToggle(blog.id);
              }}
            >
              <Heart 
                size={18} 
                className={`transition-all duration-300 ${
                  blog.isLiked ? "text-red-500 fill-red-500" : "text-gray-500 hover:text-red-400"
                }`}
              />
              <span className={`text-xs font-medium ${blog.isLiked ? 'text-red-500' : 'text-gray-600'}`}>
                {blog.likeCount}
              </span>
            </button>
            <div className="flex items-center space-x-1.5 text-gray-600">
              <MessageCircle size={18} className="text-gray-500" />
              <span className="text-xs font-medium">{blog.comments.length}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-gray-500">
              <Eye size={18} />
              <span className="text-xs font-medium">{blog.readCount}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Read Modal  */}
      <BlogReadModal 
        blog={blog}
        isOpen={isReadModalOpen}
        onClose={handleCloseReadModal}
        isAdmin={isAdmin}
        onReadCountIncremented={isAdmin ? null : onReadCountIncremented}
        onLikeToggle={isAdmin ? null : onLikeToggle}
        onCommentSubmit={isAdmin ? null : onCommentSubmit}
        onDeleteComment={isAdmin ? null : onDeleteComment}
        onToggleCommentStatus={isAdmin ? onToggleCommentStatus : null}
      />
    </>
  );
};

export default BlogCard;