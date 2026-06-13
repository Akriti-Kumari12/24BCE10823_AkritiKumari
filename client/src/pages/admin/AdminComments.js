import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { FiTrash2, FiSearch, FiMessageCircle } from 'react-icons/fi';

export default function AdminComments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/comments').then(({ data }) => setComments(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    await api.delete(`/admin/comments/${id}`);
    setComments(p => p.filter(c => c._id !== id));
    toast.success('Comment deleted');
  };

  const filtered = comments.filter(c =>
    c.content.toLowerCase().includes(search.toLowerCase()) ||
    c.author?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Helmet><title>Manage Comments — Admin</title></Helmet>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Manage Comments</h1>
          <p className="text-sm text-slate-500">{comments.length} total comments</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input type="text" placeholder="Search comments..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <FiMessageCircle size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No comments found</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {filtered.map(comment => (
                  <div key={comment._id} className="flex items-start gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group">
                    <img
                      src={comment.author?.avatar ? `http://localhost:5000${comment.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=36`}
                      alt={comment.author?.name}
                      className="w-9 h-9 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-slate-800">{comment.author?.name}</span>
                        <span className="text-xs text-slate-400">on</span>
                        <Link to={`/post/${comment.post?._id}`} target="_blank" className="text-xs text-primary-600 hover:underline font-medium truncate max-w-[200px]">
                          {comment.post?.title}
                        </Link>
                        <span className="text-xs text-slate-400 ml-auto">{moment(comment.createdAt).fromNow()}</span>
                      </div>
                      <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">{comment.content}</p>
                    </div>
                    <button onClick={() => handleDelete(comment._id)} className="flex-shrink-0 p-2 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 hover:text-red-600 transition-all opacity-0 group-hover:opacity-100">
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
