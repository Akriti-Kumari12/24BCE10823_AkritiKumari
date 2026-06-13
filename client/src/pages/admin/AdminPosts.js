import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { FiTrash2, FiSearch, FiEye, FiHeart, FiGlobe, FiLock, FiFileText } from 'react-icons/fi';

export default function AdminPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/posts').then(({ data }) => setPosts(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this post?')) return;
    await api.delete(`/admin/posts/${id}`);
    setPosts(p => p.filter(post => post._id !== id));
    toast.success('Post deleted');
  };

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Manage Posts — Admin</title></Helmet>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Manage Posts</h1>
          <p className="text-sm text-slate-500">{posts.length} total posts</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input type="text" placeholder="Search posts..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['Post', 'Author', 'Category', 'Visibility', 'Stats', 'Date', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(post => (
                  <tr key={post._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <div className="flex items-center gap-3">
                        <img src={post.coverImage ? `http://localhost:5000${post.coverImage}` : 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=60&q=80'} alt="" className="w-10 h-10 rounded-xl object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <Link to={`/post/${post._id}`} target="_blank" className="text-sm font-semibold text-slate-800 hover:text-primary-600 truncate block max-w-[180px]">{post.title}</Link>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <img src={post.author?.avatar ? `http://localhost:5000${post.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=28`} alt="" className="w-7 h-7 rounded-lg" />
                        <span className="text-xs text-slate-600 font-medium">{post.author?.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge bg-slate-100 text-slate-600 text-xs">{post.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`flex items-center gap-1 text-xs font-medium ${post.visibility === 'private' ? 'text-slate-500' : 'text-emerald-600'}`}>
                        {post.visibility === 'private' ? <FiLock size={12} /> : <FiGlobe size={12} />}
                        {post.visibility}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><FiHeart size={11} /> {post.likes?.length || 0}</span>
                        <span className="flex items-center gap-1"><FiEye size={11} /> {post.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{moment(post.createdAt).format('MMM DD, YYYY')}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => handleDelete(post._id)} className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                        <FiTrash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <FiFileText size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No posts found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
