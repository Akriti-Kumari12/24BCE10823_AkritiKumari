import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { FiX, FiImage, FiGlobe, FiLock, FiPlus, FiSend } from 'react-icons/fi';

const CATEGORIES = ['General', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Art', 'Science'];

export default function CreatePost() {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'General', visibility: 'public', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); }
  };

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !form.tags.includes(tag) && form.tags.length < 5) {
      setForm(p => ({ ...p, tags: [...p.tags, tag] }));
      setTagInput('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return toast.error('Title and content are required');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'tags' ? JSON.stringify(v) : v));
      if (image) fd.append('coverImage', image);
      const { data } = await api.post('/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Post published! 🎉');
      navigate(`/post/${data._id}`);
    } catch {
      toast.error('Failed to create post');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Write New Post — EchoBoard</title></Helmet>
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="section-title mb-2">Write New Post</h1>
            <p className="text-slate-500">Share your thoughts, stories, and vlogs with the world</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main */}
            <div className="lg:col-span-2 space-y-5">
              {/* Cover Image */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Cover Image</label>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={() => { setImage(null); setPreview(''); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600">
                      <FiX size={15} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group">
                    <FiImage size={28} className="text-slate-300 group-hover:text-primary-400 mb-2 transition-colors" />
                    <p className="text-sm text-slate-400 group-hover:text-primary-500 font-medium">Click to upload cover image</p>
                    <p className="text-xs text-slate-300">PNG, JPG, WEBP up to 5MB</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>

              {/* Title */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Post Title *</label>
                <input
                  type="text"
                  placeholder="Enter an engaging title..."
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  className="input-field text-lg font-serif font-semibold"
                  required
                />
              </div>

              {/* Excerpt */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                <textarea
                  placeholder="Brief description shown in post cards..."
                  value={form.excerpt}
                  onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))}
                  className="input-field resize-none text-sm"
                  rows={2}
                />
              </div>

              {/* Content */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content *</label>
                <textarea
                  placeholder="Write your story here... You can use HTML tags for formatting."
                  value={form.content}
                  onChange={e => setForm(p => ({ ...p, content: e.target.value }))}
                  className="input-field resize-none text-sm leading-relaxed font-mono"
                  rows={16}
                  required
                />
                <p className="text-xs text-slate-400 mt-2">Supports HTML: &lt;b&gt;, &lt;i&gt;, &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;blockquote&gt;, &lt;img&gt;</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              {/* Publish */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Publish Settings</h3>

                {/* Visibility */}
                <div className="space-y-2 mb-5">
                  <label className="block text-xs text-slate-500 font-medium mb-2">Visibility</label>
                  {[
                    { val: 'public', icon: FiGlobe, label: 'Public', desc: 'Visible to everyone' },
                    { val: 'private', icon: FiLock, label: 'Private', desc: 'Only visible to you' },
                  ].map(({ val, icon: Icon, label, desc }) => (
                    <button key={val} type="button" onClick={() => setForm(p => ({ ...p, visibility: val }))}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${form.visibility === val ? 'border-primary-400 bg-primary-50' : 'border-slate-200 hover:border-slate-300'}`}>
                      <Icon size={16} className={form.visibility === val ? 'text-primary-600' : 'text-slate-400'} />
                      <div>
                        <p className={`text-sm font-semibold ${form.visibility === val ? 'text-primary-700' : 'text-slate-700'}`}>{label}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Publishing...</span>
                    : <span className="flex items-center gap-2"><FiSend size={15} /> Publish Post</span>}
                </button>
              </div>

              {/* Category */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field text-sm">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              {/* Tags */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Tags <span className="text-xs text-slate-400 font-normal">(up to 5)</span></label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add a tag..."
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="input-field text-sm flex-1 py-2"
                  />
                  <button type="button" onClick={addTag} className="btn-secondary px-3 py-2">
                    <FiPlus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 tag pr-1.5">
                      #{tag}
                      <button type="button" onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))} className="ml-1 text-primary-400 hover:text-red-500">
                        <FiX size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
