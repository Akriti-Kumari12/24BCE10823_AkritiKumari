import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../utils/api';
import PostCard from '../components/PostCard';
import {
  FiEdit3, FiUsers, FiZap, FiArrowRight,
  FiSearch, FiChevronLeft, FiChevronRight, FiStar,
  FiBookOpen, FiAward, FiFeather
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Art', 'Science', 'General'];

const STATS = [
  { icon: FiUsers, value: '10K+', label: 'Writers' },
  { icon: FiBookOpen, value: '50K+', label: 'Stories' },
  { icon: FiStar, value: '4.9', label: 'Rating' },
  { icon: FiAward, value: '#1', label: 'Platform' },
];

export default function Home() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState('');

  const page = parseInt(searchParams.get('page') || '1');
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 9 };
    if (search) params.search = search;
    if (category && category !== 'All') params.category = category;
    api.get('/posts', { params })
      .then(res => { setPosts(res.data.posts); setTotal(res.data.total); setPages(res.data.pages); })
      .finally(() => setLoading(false));
  }, [page, search, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(p => { p.set('search', searchInput); p.set('page', '1'); return p; });
  };

  const setCategory = (cat) => {
    setSearchParams(p => {
      if (cat === 'All') p.delete('category'); else p.set('category', cat);
      p.set('page', '1');
      return p;
    });
  };

  return (
    <>
      <Helmet><title>EchoBoard — Share Your Story</title></Helmet>

      {/* Hero */}
      {!search && !category && page === 1 && (
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-primary-950 to-slate-900 min-h-[580px] flex items-center">
          <div className="absolute inset-0 bg-hero-pattern opacity-40" />
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-3xl" />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/80 text-sm font-medium mb-8">
              <FiZap size={14} className="text-accent-400" /> The Future of Storytelling is Here
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-tight mb-6">
              Every Story Deserves
              <span className="block bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                to be Heard
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Join thousands of writers sharing their vlogs, insights, and daily adventures. Your audience is waiting.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-14">
              {user ? (
                <Link to="/create" className="btn-primary text-base px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/30">
                  <FiFeather size={18} /> Start Writing Today
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary text-base px-8 py-4 rounded-2xl shadow-xl shadow-primary-500/30">
                    <FiEdit3 size={18} /> Join EchoBoard Free
                  </Link>
                  <Link to="/login" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-semibold rounded-2xl transition-all duration-200">
                    Sign In <FiArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div key={label} className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                  <Icon size={20} className="text-primary-400 mb-2" />
                  <span className="text-2xl font-bold text-white">{value}</span>
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Banner */}
      {!search && !category && page === 1 && (
        <section className="bg-white border-y border-slate-100 py-6 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-slate-500">
              {['✍️ Rich Text Editor', '🌐 Public & Private Posts', '💬 Threaded Comments', '❤️ Like & Follow', '📱 Fully Responsive', '🔒 Secure Auth', '🛡️ Admin Controls', '🔍 Full-text Search'].map(f => (
                <span key={f} className="font-medium">{f}</span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <form onSubmit={handleSearch} className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input
                type="text"
                placeholder="Search stories, topics, authors..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="input-field pl-11"
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                (category === cat || (!category && cat === 'All'))
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="section-title text-2xl">
            {search ? `Results for "${search}"` : category && category !== 'All' ? category : 'Latest Stories'}
          </h2>
          <span className="text-sm text-slate-500">{total} {total === 1 ? 'post' : 'posts'}</span>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-slate-100 animate-pulse">
                <div className="h-52 bg-slate-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-full" />
                  <div className="h-3 bg-slate-200 rounded-full w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBookOpen size={32} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-slate-700 mb-2">No stories found</h3>
            <p className="text-slate-500 mb-6">{search ? 'Try different keywords' : 'Be the first to write something!'}</p>
            {user && <Link to="/create" className="btn-primary">Write the First Post</Link>}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button
              onClick={() => setSearchParams(p => { p.set('page', String(page - 1)); return p; })}
              disabled={page === 1}
              className="btn-secondary px-4 py-2 disabled:opacity-40"
            >
              <FiChevronLeft size={16} />
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setSearchParams(p => { p.set('page', String(i + 1)); return p; })}
                className={`w-10 h-10 rounded-xl font-semibold text-sm transition-all ${page === i + 1 ? 'bg-primary-600 text-white shadow-md' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setSearchParams(p => { p.set('page', String(page + 1)); return p; })}
              disabled={page === pages}
              className="btn-secondary px-4 py-2 disabled:opacity-40"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {!user && (
        <section className="bg-gradient-to-r from-primary-600 to-accent-500 py-16 mt-8">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">Ready to Share Your Story?</h2>
            <p className="text-primary-100 text-lg mb-8">Join our community of storytellers and make your voice heard.</p>
            <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 text-base">
              <FiEdit3 size={18} /> Create Your Free Account
            </Link>
          </div>
        </section>
      )}
    </>
  );
}
