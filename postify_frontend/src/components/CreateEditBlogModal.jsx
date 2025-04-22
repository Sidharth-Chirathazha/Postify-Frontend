import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X, Upload, Trash2 } from 'lucide-react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { createBlog, updateBlog } from '../redux/slices/blogSlice';
import axiosInstance from '../api/axiosInstance';
import { showSuccessToast, showErrorToast } from '../utils/toastConfig';

const CreateEditBlogModal = ({ isOpen, onClose, blogToEdit = null }) => {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();
  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const isEditMode = !!blogToEdit;

  // Validation regex for no leading special characters
  const noLeadingSpecialChar = /^(?![!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).*$/;

  // Populate form when editing
  useEffect(() => {
    if (blogToEdit) {
      setValue('title', blogToEdit.title || '');
      setValue('content', blogToEdit.content || '');
      
      if (blogToEdit.images) {
        const existingImages = [
          blogToEdit.image_1,
          blogToEdit.image_2,
          blogToEdit.image_3
        ].filter(Boolean).map(url => ({
          preview: url,
          isExisting: true
        }));
        setImages(existingImages);
      }
    } else {
      reset();
      setImages([]);
    }
  }, [blogToEdit, setValue, reset]);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    const invalidFiles = files.filter(file => file.size > 2 * 1024 * 1024);
    if (invalidFiles.length > 0) {
      alert('All images must be less than 2MB');
      return;
    }

    try {
      // Get Cloudinary signature
      const { data: cloudinaryConfig } = await axiosInstance.get('cloudinary-signature/');
      
      const newImages = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('api_key', cloudinaryConfig.api_key);
          formData.append('timestamp', cloudinaryConfig.timestamp);
          formData.append('signature', cloudinaryConfig.signature);
          formData.append('upload_preset', cloudinaryConfig.upload_preset);

          const response = await axios.post(
            `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloud_name}/image/upload`,
            formData
          );

          return {
            file,
            preview: response.data.secure_url,
            isExisting: false
          };
        })
      );

      setImages(prev => [...prev, ...newImages].slice(0, 3));
    } catch (error) {
      console.error('Image upload failed:', error);
      alert('Failed to upload images');
    }
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Prepare blog data
      const blogData = {
        title: data.title,
        content: data.content,
        image_1: images[0]?.preview || null,
        image_2: images[1]?.preview || null,
        image_3: images[2]?.preview || null
      };

      if (isEditMode) {
        await dispatch(updateBlog({ id: blogToEdit.id, blogData })).unwrap();
        showSuccessToast('Blog updated successfully!');
      } else {
        await dispatch(createBlog(blogData)).unwrap();
        showSuccessToast('Blog created successfully!');
      }
      onClose();
    } catch (error) {
      alert(`Error ${isEditMode ? 'updating' : 'creating'} blog`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-primary">
            {isEditMode ? 'Edit Blog' : 'Create New Blog'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-primary">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Title input */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              {...register('title', {
                required: 'Title is required',
                pattern: {
                  value: noLeadingSpecialChar,
                  message: 'Title cannot start with special characters'
                }
              })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="Enter your blog title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          {/* Image upload */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Images (up to 3, max 2MB each)
            </label>
            
            {images.length < 3 && (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-primary">
                <label className="cursor-pointer w-full h-full block">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Upload className="mx-auto mb-2" size={24} />
                  <p className="text-gray-500">Click to upload images</p>
                </label>
              </div>
            )}

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-2">
                {images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-black bg-opacity-50 text-white p-1 rounded-full"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Content textarea */}
          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 font-medium mb-1">
              Content *
            </label>
            <textarea
              id="content"
              {...register('content', {
                required: 'Content is required',
                pattern: {
                  value: noLeadingSpecialChar,
                  message: 'Content cannot start with special characters'
                }
              })}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary h-40"
              placeholder="Write your blog content here..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg mr-2"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg"
              disabled={isLoading}
            >
              {isLoading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Blog" : "Publish Blog")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEditBlogModal;