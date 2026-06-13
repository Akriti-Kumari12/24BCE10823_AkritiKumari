import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiGrid, FiUsers, FiFileText, FiMessageCircle, FiShield,
  FiLogOut, FiMenu, FiX, FiChevronRight, FiHome
} from 'react-icons/fi';

const NAV = [
  { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
  { path: '/admin/users', label: 'Users', icon: FiUsers },
  { path: '/admin/posts', label: 'Posts', icon: FiFileText },
  { path: '/admin/comments', label: 'Comments', icon: FiMessageCircle },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const isActive = (path, exact) => exact ? location.pathname === path : location.pathname.startsWith(path);

  const avatarUrl = user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'A')}&background=f59e0b&color=fff&bold=true`;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-auto`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-6 h-16 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
              <FiShield size={16} className="text-white" />
            </div>
            <span className="text-base font-serif font-bold text-white">Admin Panel</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white"><FiX size={20} /></button>
        </div>

        {/* User info */}
        <div className="px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <img src={avatarUrl} alt={user?.name} className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                <span className="text-xs text-slate-400">Administrator</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-4 flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-2 mb-3">Management</p>
          <div className="space-y-1">
            {NAV.map(({ path, label, icon: Icon, exact }) => (
              <Link key={path} to={path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${isActive(path, exact) ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <span className="flex items-center gap-3">
                  <Icon size={17} />
                  {label}
                </span>
                {isActive(path, exact) && <FiChevronRight size={14} />}
              </Link>
            ))}
          </div>

          <div className="border-t border-slate-800 mt-4 pt-4 space-y-1">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
              <FiHome size={17} /> View Site
            </Link>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all">
              <FiLogOut size={17} /> Sign Out
            </button>
          </div>
        </nav>
      </aside>

      {/* Overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-slate-100 text-slate-600">
            <FiMenu size={20} />
          </button>
          <div className="flex-1">
            <nav className="flex items-center gap-2 text-sm text-slate-500">
              <span>Admin</span>
              <FiChevronRight size={14} />
              <span className="text-slate-800 font-medium capitalize">{location.pathname.split('/')[2] || 'Dashboard'}</span>
            </nav>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center">
              <FiShield size={15} className="text-amber-600" />
            </div>
            <span className="hidden sm:block text-sm font-semibold text-slate-700">{user?.name}</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
