import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import {
  FiEdit3, FiTrash2, FiEye, FiHeart, FiGlobe, FiLock,
  FiPlus, FiUser, FiGrid, FiList, FiCamera, FiSave, FiX,
  FiBookOpen
} from 'react-icons/fi';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const fileRef = useRef();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: user?.name || '', bio: user?.bio || '', username: user?.username || '' });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    api.get('/posts/my').then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/posts/${id}`);
    setPosts(p => p.filter(post => post._id !== id));
    toast.success('Post deleted');
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(profileForm).forEach(([k, v]) => fd.append(k, v));
      if (avatarFile) fd.append('avatar', avatarFile);
      const { data } = await api.put('/auth/profile', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ ...user, ...data });
      setEditProfile(false);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarUrl = avatarPreview || (user?.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=128`);
  const filtered = filter === 'all' ? posts : posts.filter(p => p.visibility === filter);
  const totalLikes = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);
  const totalViews = posts.reduce((sum, p) => sum + (p.views || 0), 0);

  return (
    <>
      <Helmet><title>Dashboard — EchoBoard</title></Helmet>
      <div className="min-h-screen bg-slate-50">
        {/* Header Banner */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar */}
              <div className="relative group">
                <img src={avatarUrl} alt={user?.name} className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/20" />
                {editProfile && (
                  <button onClick={() => fileRef.current.click()}
                    className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                    <FiCamera size={20} className="text-white" />
                  </button>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => {
                  const f = e.target.files[0];
                  if (f) { setAvatarFile(f); setAvatarPreview(URL.createObjectURL(f)); }
                }} />
              </div>

              <div className="flex-1">
                {editProfile ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40" placeholder="Full name" />
                    <input value={profileForm.username} onChange={e => setProfileForm(p => ({ ...p, username: e.target.value }))}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40" placeholder="Username" />
                    <input value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                      className="bg-white/10 border border-white/20 rounded-xl px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:border-white/40 flex-1" placeholder="Bio" />
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-serif font-bold text-white">{user?.name}</h1>
                    <p className="text-slate-400 text-sm">@{user?.username}</p>
                    {user?.bio && <p className="text-slate-300 text-sm mt-1">{user.bio}</p>}
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                {editProfile ? (
                  <>
                    <button onClick={handleSaveProfile} disabled={saving} className="btn-primary text-sm py-2">
                      {saving ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <><FiSave size={14} /> Save</>}
                    </button>
                    <button onClick={() => { setEditProfile(false); setAvatarPreview(''); }} className="btn-secondary text-sm py-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                      <FiX size={14} />
                    </button>
                  </>
                ) : (
                  <button onClick={() => setEditProfile(true)} className="btn-secondary text-sm py-2 bg-white/10 border-white/20 text-white hover:bg-white/20">
                    <FiUser size={14} /> Edit Profile
                  </button>
                )}
                <Link to="/create" className="btn-primary text-sm py-2">
                  <FiPlus size={14} /> New Post
                </Link>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {[
                { icon: FiBookOpen, val: posts.length, label: 'Total Posts' },
                { icon: FiHeart, val: totalLikes, label: 'Total Likes' },
                { icon: FiEye, val: totalViews, label: 'Total Views' },
                { icon: FiGlobe, val: posts.filter(p => p.visibility === 'public').length, label: 'Public Posts' },
              ].map(({ icon: Icon, val, label }) => (
                <div key={label} className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl p-4 text-center">
                  <Icon size={20} className="text-primary-400 mx-auto mb-1" />
                  <p className="text-2xl font-bold text-white">{val}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2">
              {['all', 'public', 'private'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === f ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}>
                  {f === 'all' ? `All (${posts.length})` : f === 'public' ? `Public (${posts.filter(p => p.visibility === 'public').length})` : `Private (${posts.filter(p => p.visibility === 'private').length})`}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setView('grid')} className={`p-2.5 rounded-xl border transition-all ${view === 'grid' ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-slate-200 text-slate-500'}`}><FiGrid size={16} /></button>
              <button onClick={() => setView('list')} className={`p-2.5 rounded-xl border transition-all ${view === 'list' ? 'bg-primary-50 border-primary-200 text-primary-600' : 'bg-white border-slate-200 text-slate-500'}`}><FiList size={16} /></button>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-100" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <FiBookOpen size={40} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-serif font-semibold text-slate-600 mb-2">No posts yet</h3>
              <p className="text-slate-400 mb-6">Start sharing your stories with the world</p>
              <Link to="/create" className="btn-primary">Write Your First Post</Link>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
              {filtered.map(post => (
                <div key={post._id} className="relative group">
                  <PostCard post={post} />
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                    <Link to={`/edit/${post._id}`} className="w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-primary-600 hover:shadow-lg transition-all">
                      <FiEdit3 size={14} />
                    </Link>
                    <button onClick={() => handleDelete(post._id)} className="w-8 h-8 bg-white rounded-xl shadow-md flex items-center justify-center text-slate-600 hover:text-red-500 hover:shadow-lg transition-all">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3 animate-fade-in">
              {filtered.map(post => (
                <div key={post._id} className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 hover:border-slate-200 hover:shadow-sm transition-all">
                  <img src={post.coverImage ? `http://localhost:5000${post.coverImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=100&q=80'} alt={post.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <Link to={`/post/${post._id}`} className="font-serif font-semibold text-slate-900 hover:text-primary-600 transition-colors text-sm truncate block">{post.title}</Link>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                      <span>{moment(post.createdAt).format('MMM DD, YYYY')}</span>
                      <span className="flex items-center gap-1">{post.visibility === 'private' ? <FiLock size={10} /> : <FiGlobe size={10} />}{post.visibility}</span>
                      <span className="flex items-center gap-1"><FiHeart size={10} /> {post.likes?.length || 0}</span>
                      <span className="flex items-center gap-1"><FiEye size={10} /> {post.views || 0}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link to={`/edit/${post._id}`} className="btn-secondary text-xs py-1.5 px-3"><FiEdit3 size={12} /> Edit</Link>
                    <button onClick={() => handleDelete(post._id)} className="btn-danger text-xs py-1.5 px-3"><FiTrash2 size={12} /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
