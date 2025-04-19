import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Navigation */}
      <nav className="bg-primary text-cream p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Postify</h1>
          <div className="space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 bg-cream text-primary font-medium rounded hover:bg-opacity-90 transition"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/register')}
              className="px-4 py-2 border border-cream text-cream font-medium rounded hover:bg-cream hover:bg-opacity-10 transition"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex-grow flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-6">Share Your Story With The World</h2>
          <p className="text-xl md:text-2xl text-primary/80 mb-12 max-w-3xl mx-auto">
            Welcome to BlogSphere, where ideas come to life. Create, read, and connect through the power of words.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/register')}
              className="px-8 py-3 bg-primary text-cream font-medium rounded-lg text-lg hover:bg-primary/90 transition"
            >
              Get Started
            </button>
            <button 
              onClick={() => navigate('/blogs')}
              className="px-8 py-3 border border-primary text-primary font-medium rounded-lg text-lg hover:bg-primary/5 transition"
            >
              Browse Blogs
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary text-cream py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BlogSphere. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}