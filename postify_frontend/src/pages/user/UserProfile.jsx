import React, { useState, useRef, useEffect, use } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import LoadingSpinner from '../../components/Loading';
import axiosInstance from '../../api/axiosInstance';
import { showSuccessToast, showErrorToast } from '../../utils/toastConfig';

const UserProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);
  

  const user = useSelector(state => state.auth.user) || {};
  const isUpdating = useSelector(state => state.auth.isUpdating);
  const userError = useSelector(state => state.auth.userError);

  useEffect(() => {
    if(userError) {
      showErrorToast(userError);
    }
  }, [userError]);
  

  const [formData, setFormData] = useState({
    username: '',
    first_name: '',
    last_name: ''
  });
  

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  

  useEffect(() => {
    if (user && !isEditing) {
      setFormData({
        username: user.username || '',
        first_name: user.first_name || '',
        last_name: user.last_name || ''
      });
    }
  }, [user]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  

  const handleProfilePicSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImageFile(file);
    

    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      setImagePreview(fileReader.result);
    };
    fileReader.readAsDataURL(file);
  };
  

  const uploadToCloudinary = async () => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    
    try {
      
      const {data} = await axiosInstance.get('cloudinary-signature/'); // Get Cloudinary signature
      
      
      const formData = new FormData();
      formData.append('file', imageFile);
      formData.append('api_key', data.api_key);
      formData.append('timestamp', data.timestamp);
      formData.append('upload_preset', data.upload_preset);
      formData.append('signature', data.signature);
      
      // Make the upload request
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${data.cloud_name}/image/upload`, // Replace with your cloud name
        {
          method: 'POST',
          body: formData
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const result = await response.json();
      return result.secure_url; // Return the secure URL from Cloudinary
      
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // Check if we need to upload a new profile picture
      let profilePictureUrl = user.profile_pic;
      
      if (imageFile) {
        const uploadedUrl = await uploadToCloudinary();
        if (uploadedUrl) {
          profilePictureUrl = uploadedUrl;
        }
      }
      
      // Create user data to update
      const updatedUserData = {
        ...formData,
        profile_pic: profilePictureUrl
      };
      

      const result = await dispatch(updateUser(updatedUserData)).unwrap();
      

      setIsEditing(false);
      showSuccessMessage();
      

      setImageFile(null);
      setImagePreview('');
      
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };
  

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };
  

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  
  return (
    <div className="min-h-screen bg-cream py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-cream p-6">
            <h1 className="text-2xl font-bold">My Profile</h1>
            <p className="text-cream/80">Manage your personal information</p>
          </div>
          
          {/* Success message */}
          {showSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 m-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Checkmark icon */}
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your profile has been updated successfully.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row">
              {/* Profile Picture */}
              <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-primary">
                    {imagePreview ? (
               
                      <img 
                        src={imagePreview} 
                        alt="Profile Preview" 
                        className="w-full h-full object-cover"
                      />
                    ) : user?.profile_pic ? (
                   
                      <img 
                        src={user.profile_pic} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                    
                      <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Overlay for hover effect */}
                    <div 
                      className="absolute inset-0 bg-primary bg-opacity-0 hover:bg-opacity-40 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200"
                      onClick={triggerFileInput}
                    >
                      <span className="text-transparent group-hover:text-cream transition-all duration-200 font-medium">Change</span>
                    </div>
                  </div>
                  
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleProfilePicSelect} 
                    className="hidden"
                    accept="image/*"
                  />
                  
                  {(uploadingImage || isUpdating) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75 rounded-full">
                      <LoadingSpinner size="small" />
                    </div>
                  )}
                </div>
                <button 
                  onClick={triggerFileInput}
                  className="mt-4 text-primary hover:text-primary/80 font-medium text-sm"
                >
                  Upload new photo
                </button>
                {imagePreview && (
                  <p className="text-xs text-gray-500 mt-1">
                    Image will be uploaded when you save changes
                  </p>
                )}
              </div>
              
              {/* User Details Form */}
              <div className="flex-1">
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="username"
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                          disabled={saving || isUpdating}
                        />
                      ) : (
                        <p className="text-gray-900 py-2">{user.username}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                          First Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={saving || isUpdating}
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.first_name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                          Last Name
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            disabled={saving || isUpdating}
                          />
                        ) : (
                          <p className="text-gray-900 py-2">{user.last_name}</p>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address <span className="text-gray-500 text-xs">(cannot be changed)</span>
                      </label>
                      <p className="text-gray-900 py-2">{user.email}</p>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      {isEditing ? (
                        <div className="flex space-x-4">
                          <button
                            type="button"
                            onClick={() => {
                              setIsEditing(false);
                              setImageFile(null);
                              setImagePreview('');
                            }}
                            className="px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition"
                            disabled={saving || isUpdating}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-cream font-medium rounded-md hover:bg-primary/90 transition flex items-center"
                            disabled={saving || isUpdating}
                          >
                            {(saving || isUpdating) ? (
                              <>
                                <LoadingSpinner size="small" color="cream" />
                                <span className="ml-2">Saving...</span>
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setIsEditing(true)}
                          className="px-4 py-2 bg-primary text-cream font-medium rounded-md hover:bg-primary/90 transition"
                        >
                          Edit Profile
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;