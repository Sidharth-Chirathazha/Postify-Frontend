import React, { useState } from 'react';
import { Heart, MessageCircle, Eye, Trash2, Edit } from 'lucide-react';
import BlogReadModal from './BlogReadModal';

const BlogCard = ({ 
  blog, 
  isMyBlog = false, 
  onDelete, 
  onEdit, 
  onReadCountIncremented,
  onLikeToggle,
  onCommentSubmit,
  onDeleteComment
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isReadModalOpen, setIsReadModalOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleNextImage = (e) => {
    e.stopPropagation(); // Prevent opening the read modal
    setActiveImageIndex((prev) => (prev === blog.images.length - 1 ? 0 : prev + 1));
  };

  const handlePrevImage = (e) => {
    e.stopPropagation(); // Prevent opening the read modal
    setActiveImageIndex((prev) => (prev === 0 ? blog.images.length - 1 : prev - 1));
  };
  
  const handleOpenReadModal = () => {
    setIsReadModalOpen(true);
  };

  const handleCloseReadModal = () => {
    setIsReadModalOpen(false);
  };
  
  const handleEditClick = (e, blogId) => {
    e.stopPropagation(); // Prevent opening the read modal
    onEdit(blogId);
  };
  
  const handleDeleteClick = (e, blogId) => {
    e.stopPropagation(); // Prevent opening the read modal
    onDelete(blogId);
  };

  return (
    <>
      <div 
        className={`bg-cream rounded-2xl shadow-lg overflow-hidden mb-6 cursor-pointer transition-all duration-300 ${isHovered ? 'transform scale-[1.01]' : ''}`}
        onClick={handleOpenReadModal}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Author info with lighter background */}
        <div className="flex items-center justify-between p-4 bg-cream border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary ring-offset-2 mr-3">
              <img 
                src={blog.author.profile_pic} 
                alt={blog.author.username} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-primary">{blog.author.username}</p>
              <p className="text-gray-500 text-sm">{blog.date}</p>
            </div>
          </div>
          
          {isMyBlog && (
            <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
              <button 
                onClick={(e) => handleEditClick(e, blog.id)} 
                className="text-gray-500 hover:text-primary p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Edit size={18} />
              </button>
              <button 
                onClick={(e) => handleDeleteClick(e, blog.id)} 
                className="text-gray-500 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Blog title */}
        <h2 className="text-xl font-bold px-5 pt-4 pb-2 text-primary">{blog.title}</h2>

        {/* Images carousel */}
        <div className="relative">
          <div className="overflow-hidden h-64 bg-gray-100">
            <img 
              src={blog.images[activeImageIndex]} 
              alt={`Blog image ${activeImageIndex + 1}`}
              className="w-full h-full object-cover transition-transform duration-500"
            />
          </div>
          
          {blog.images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-cream bg-opacity-80 text-primary p-2 rounded-full hover:bg-opacity-100 transition-all shadow-md"
              >
                &lt;
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-cream bg-opacity-80 text-primary p-2 rounded-full hover:bg-opacity-100 transition-all shadow-md"
              >
                &gt;
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
                {blog.images.map((_, index) => (
                  <div 
                    key={index} 
                    className={`w-2 h-2 rounded-full transition-all ${index === activeImageIndex ? 'bg-primary w-4' : 'bg-gray-300'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Blog content preview */}
        <div className="p-5 bg-cream">
          <p className="text-gray-700 mb-4 leading-relaxed">
            {blog.content.length > 150 
              ? `${blog.content.substring(0, 150)}...`
              : blog.content}
            {blog.content.length > 150 && (
              <span className="text-primary font-semibold ml-1 hover:underline">Read more</span>
            )}
          </p>
          
          {/* Engagement stats with subtle card footer */}
          <div className="flex items-center justify-between text-gray-700 border-t border-gray-200 pt-4 mt-2">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2 group">
                <Heart size={18} className={`group-hover:scale-110 transition-transform ${blog.isLiked ? "text-red-500 fill-red-500" : ""}`} />
                <span>{blog.likeCount}</span>
              </div>
              <div className="flex items-center space-x-2 group">
                <MessageCircle size={18} className="group-hover:scale-110 transition-transform" />
                <span>{blog.comments.length}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-gray-500">
              <Eye size={18} />
              <span>{blog.readCount} Views</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Blog Read Modal - with all interactive functionality */}
      <BlogReadModal 
        blog={blog}
        isOpen={isReadModalOpen}
        onClose={handleCloseReadModal}
        onReadCountIncremented={onReadCountIncremented}
        onLikeToggle={onLikeToggle}
        onCommentSubmit={onCommentSubmit}
        onDeleteComment={onDeleteComment}
      />
    </>
  );
};

export default BlogCard;