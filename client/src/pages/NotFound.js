import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FiHome, FiBookOpen } from 'react-icons/fi';

export default function NotFound() {
  return (
    <>
      <Helmet><title>404 Not Found — EchoBoard</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/30">
            <FiBookOpen size={40} className="text-white" />
          </div>
          <h1 className="text-8xl font-serif font-bold gradient-text mb-4">404</h1>
          <h2 className="text-2xl font-serif font-bold text-slate-800 mb-3">Page Not Found</h2>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">The story you're looking for seems to have wandered off. Let's get you back to somewhere familiar.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/" className="btn-primary"><FiHome size={16} /> Back to Home</Link>
            <Link to="/create" className="btn-secondary">Write a Story</Link>
          </div>
        </div>
      </div>
    </>
  );
}
