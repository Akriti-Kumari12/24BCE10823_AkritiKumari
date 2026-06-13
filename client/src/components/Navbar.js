import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiEdit3, FiLogOut, FiUser, FiMenu, FiX,
  FiGrid, FiShield, FiBookOpen
} from 'react-icons/fi';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); };

  const avatarUrl = user?.avatar
    ? `http://localhost:5000${user.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0ea5e9&color=fff&bold=true`;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white border-b border-slate-100'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <FiBookOpen className="text-white text-lg" />
            </div>
            <span className="text-xl font-serif font-bold gradient-text">EchoBoard</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>Explore</Link>
            {user && (
              <>
                <Link to="/dashboard" className={`text-sm font-medium transition-colors ${location.pathname === '/dashboard' ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'}`}>My Posts</Link>
                {isAdmin && (
                  <Link to="/admin" className="text-sm font-medium text-amber-600 hover:text-amber-700 flex items-center gap-1">
                    <FiShield size={14} /> Admin
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link to="/create" className="btn-primary text-sm py-2">
                  <FiEdit3 size={15} /> Write Post
                </Link>
                <div className="relative" ref={dropdownRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 transition-colors">
                    <img src={avatarUrl} alt={user.name} className="w-9 h-9 rounded-xl object-cover ring-2 ring-primary-100" />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 animate-fade-in">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                        <p className="text-xs text-slate-500">@{user.username}</p>
                      </div>
                      <Link to={`/profile/${user.username}`} onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <FiUser size={15} className="text-slate-400" /> My Profile
                      </Link>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <FiGrid size={15} className="text-slate-400" /> Dashboard
                      </Link>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-amber-600 hover:bg-amber-50 transition-colors">
                          <FiShield size={15} /> Admin Panel
                        </Link>
                      )}
                      <div className="border-t border-slate-100 mt-1 pt-1">
                        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                          <FiLogOut size={15} /> Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-secondary text-sm py-2">Sign In</Link>
                <Link to="/register" className="btn-primary text-sm py-2">Get Started</Link>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-2 animate-slide-up shadow-lg">
          {user && (
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
              <img src={avatarUrl} alt={user.name} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="font-semibold text-slate-800 text-sm">{user.name}</p>
                <p className="text-xs text-slate-500">@{user.username}</p>
              </div>
            </div>
          )}
          <Link to="/" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">Explore</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">My Posts</Link>
              <Link to={`/profile/${user.username}`} className="block px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">My Profile</Link>
              <Link to="/create" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50">Write Post</Link>
              {isAdmin && <Link to="/admin" className="block px-3 py-2.5 rounded-xl text-sm font-medium text-amber-600 hover:bg-amber-50">Admin Panel</Link>}
              <button onClick={handleLogout} className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50">Sign Out</button>
            </>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" className="btn-secondary text-sm flex-1 justify-center">Sign In</Link>
              <Link to="/register" className="btn-primary text-sm flex-1 justify-center">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
