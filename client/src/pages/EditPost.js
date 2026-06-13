import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { FiX, FiImage, FiGlobe, FiLock, FiPlus, FiSave } from 'react-icons/fi';

const CATEGORIES = ['General', 'Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Art', 'Science'];

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef();
  const [form, setForm] = useState({ title: '', content: '', excerpt: '', category: 'General', visibility: 'public', tags: [] });
  const [tagInput, setTagInput] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get(`/posts/${id}`).then(({ data }) => {
      setForm({ title: data.title, content: data.content, excerpt: data.excerpt || '', category: data.category || 'General', visibility: data.visibility, tags: data.tags || [] });
      if (data.coverImage) setPreview(`http://localhost:5000${data.coverImage}`);
    }).finally(() => setFetching(false));
  }, [id]);

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
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, k === 'tags' ? JSON.stringify(v) : v));
      if (image) fd.append('coverImage', image);
      await api.put(`/posts/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Post updated!');
      navigate(`/post/${id}`);
    } catch {
      toast.error('Failed to update post');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <>
      <Helmet><title>Edit Post — EchoBoard</title></Helmet>
      <div className="min-h-screen bg-slate-50 py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="mb-8">
            <h1 className="section-title mb-2">Edit Post</h1>
            <p className="text-slate-500">Update your story</p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Cover Image</label>
                {preview ? (
                  <div className="relative rounded-xl overflow-hidden">
                    <img src={preview} alt="preview" className="w-full h-48 object-cover" />
                    <button type="button" onClick={() => { setImage(null); setPreview(''); }}
                      className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center">
                      <FiX size={15} />
                    </button>
                  </div>
                ) : (
                  <div onClick={() => fileRef.current.click()}
                    className="border-2 border-dashed border-slate-200 rounded-xl h-44 flex flex-col items-center justify-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-all group">
                    <FiImage size={28} className="text-slate-300 group-hover:text-primary-400 mb-2" />
                    <p className="text-sm text-slate-400">Click to upload cover image</p>
                  </div>
                )}
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title *</label>
                <input type="text" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-field text-lg font-serif font-semibold" required />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Short Description</label>
                <textarea value={form.excerpt} onChange={e => setForm(p => ({ ...p, excerpt: e.target.value }))} className="input-field resize-none text-sm" rows={2} />
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content *</label>
                <textarea value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} className="input-field resize-none text-sm leading-relaxed font-mono" rows={16} required />
              </div>
            </div>

            <div className="space-y-5">
              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <h3 className="text-sm font-semibold text-slate-700 mb-4">Publish Settings</h3>
                <div className="space-y-2 mb-5">
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
                  {loading ? <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Saving...</span>
                    : <span className="flex items-center gap-2"><FiSave size={15} /> Save Changes</span>}
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Category</label>
                <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-field text-sm">
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="bg-white rounded-2xl border border-slate-100 p-5">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Tags</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" placeholder="Add a tag..." value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                    className="input-field text-sm flex-1 py-2" />
                  <button type="button" onClick={addTag} className="btn-secondary px-3 py-2"><FiPlus size={16} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1 tag pr-1.5">
                      #{tag}
                      <button type="button" onClick={() => setForm(p => ({ ...p, tags: p.tags.filter(t => t !== tag) }))} className="ml-1 text-primary-400 hover:text-red-500"><FiX size={11} /></button>
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
