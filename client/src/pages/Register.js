import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiAtSign, FiBookOpen, FiArrowRight, FiCheck } from 'react-icons/fi';

const PERKS = ['Publish public or private posts', 'Connect with readers worldwide', 'Like, comment & follow writers', 'Personalized dashboard & analytics'];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', password: '', confirm: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return toast.error('Passwords do not match');
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      await register(form.name, form.username, form.email, form.password);
      toast.success('Welcome to EchoBoard! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet><title>Create Account — EchoBoard</title></Helmet>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-primary-50 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

          {/* Left — Promo */}
          <div className="hidden lg:block">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
              <FiBookOpen size={24} className="text-white" />
            </div>
            <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4 leading-tight">
              Join the EchoBoard<br />
              <span className="gradient-text">Writer Community</span>
            </h2>
            <p className="text-slate-500 text-lg mb-8 leading-relaxed">
              Start sharing your stories, vlogs, and thoughts with readers around the world.
            </p>
            <div className="space-y-4">
              {PERKS.map((perk, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FiCheck size={13} className="text-primary-600 font-bold" />
                  </div>
                  <span className="text-slate-700 font-medium text-sm">{perk}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Form */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/80 overflow-hidden">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 px-8 py-8 text-center">
              <h1 className="text-2xl font-serif font-bold text-white mb-1">Create Account</h1>
              <p className="text-slate-400 text-sm">Start your writing journey today</p>
            </div>

            <div className="px-8 py-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field pl-9 py-2.5 text-sm" required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">Username</label>
                    <div className="relative">
                      <FiAtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="text" placeholder="johndoe" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, '') })} className="input-field pl-9 py-2.5 text-sm" required />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field pl-9 py-2.5 text-sm" required />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type={showPassword ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field pl-9 pr-10 py-2.5 text-sm" required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                  <div className="relative">
                    <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                    <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="input-field pl-9 py-2.5 text-sm" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-sm mt-2 disabled:opacity-60">
                  {loading ? (
                    <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Creating account...</span>
                  ) : (
                    <span className="flex items-center gap-2">Create Free Account <FiArrowRight size={15} /></span>
                  )}
                </button>
              </form>

              <p className="text-center text-xs text-slate-500 mt-5">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
