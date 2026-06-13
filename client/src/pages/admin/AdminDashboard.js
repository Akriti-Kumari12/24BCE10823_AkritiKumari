import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import api from '../../utils/api';
import { FiUsers, FiFileText, FiMessageCircle, FiArrowRight, FiEye, FiHeart } from 'react-icons/fi';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white rounded-2xl animate-pulse" />)}
      </div>
    </div>
  );

  const STAT_CARDS = [
    { label: 'Total Users', value: stats?.totalUsers, icon: FiUsers, color: 'from-blue-500 to-blue-600', link: '/admin/users' },
    { label: 'Total Posts', value: stats?.totalPosts, icon: FiFileText, color: 'from-emerald-500 to-emerald-600', link: '/admin/posts' },
    { label: 'Comments', value: stats?.totalComments, icon: FiMessageCircle, color: 'from-purple-500 to-purple-600', link: '/admin/comments' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — EchoBoard</title></Helmet>

      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-slate-900 mb-1">Dashboard Overview</h1>
        <p className="text-slate-500 text-sm">Welcome back! Here's what's happening on EchoBoard.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {STAT_CARDS.map(({ label, value, icon: Icon, color, link }) => (
          <Link key={label} to={link} className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg shadow-${color.split('-')[1]}-500/30`}>
                <Icon size={22} className="text-white" />
              </div>
              <FiArrowRight size={16} className="text-slate-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
            </div>
            <p className="text-3xl font-bold text-slate-900 mb-1">{value?.toLocaleString()}</p>
            <p className="text-sm text-slate-500 font-medium">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Posts</h2>
            <Link to="/admin/posts" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">View all <FiArrowRight size={12} /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recentPosts?.map(post => (
              <div key={post._id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                <img src={post.coverImage ? `http://localhost:5000${post.coverImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=60&q=80'} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/post/${post._id}`} className="text-sm font-medium text-slate-800 hover:text-primary-600 truncate block">{post.title}</Link>
                  <p className="text-xs text-slate-400">by {post.author?.name} · {moment(post.createdAt).fromNow()}</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 flex-shrink-0">
                  <span className="flex items-center gap-1"><FiHeart size={11} /> {post.likes?.length || 0}</span>
                  <span className="flex items-center gap-1"><FiEye size={11} /> {post.views || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">Recent Users</h2>
            <Link to="/admin/users" className="text-xs text-primary-600 font-semibold hover:underline flex items-center gap-1">View all <FiArrowRight size={12} /></Link>
          </div>
          <div className="divide-y divide-slate-50">
            {stats?.recentUsers?.map(user => (
              <div key={user._id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                <img
                  src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff&bold=true&size=40`}
                  alt={user.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{user.name}</p>
                  <p className="text-xs text-slate-400">@{user.username} · {moment(user.createdAt).fromNow()}</p>
                </div>
                <div className="flex-shrink-0">
                  {user.role === 'admin' ? (
                    <span className="badge bg-amber-100 text-amber-700">Admin</span>
                  ) : user.isRestricted ? (
                    <span className="badge bg-red-100 text-red-600">Restricted</span>
                  ) : (
                    <span className="badge bg-emerald-100 text-emerald-600">Active</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
