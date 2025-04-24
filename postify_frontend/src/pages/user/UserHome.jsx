import React from 'react'
import { useNavigate } from 'react-router-dom';

const UserHome = () => {
    const navigate = useNavigate();

    return (
        <div className="flex items-center justify-center py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-6">Share Your Story With The World</h2>
          <p className="text-xl md:text-2xl text-primary/80 mb-12 max-w-3xl mx-auto">
            Welcome to BlogSphere, where ideas come to life. Create, read, and connect through the power of words.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => navigate('/user/my-blogs')}
                className="px-8 py-3 bg-primary text-cream font-medium rounded-lg text-lg hover:bg-primary/90 transition"
              >
                Create Post
              </button>
            <button 
              onClick={() => navigate('/user/explore')}
              className="px-8 py-3 border border-primary text-primary font-medium rounded-lg text-lg hover:bg-primary/5 transition"
            >
              Browse Blogs
            </button>
          </div>
        </div>
      </div>
    );
};

export default UserHome;