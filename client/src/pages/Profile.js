import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import toast from 'react-hot-toast';
import { FiCalendar, FiBookOpen, FiHeart, FiEye, FiUserPlus, FiUserCheck } from 'react-icons/fi';

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    api.get(`/users/${username}`).then(({ data }) => {
      setProfile(data.user);
      setPosts(data.posts);
      if (user) setFollowing(data.user.followers?.includes(user.id || user._id));
    }).finally(() => setLoading(false));
  }, [username, user]);

  const handleFollow = async () => {
    if (!user) return toast.error('Sign in to follow');
    await api.post(`/users/${profile._id}/follow`);
    setFollowing(!following);
    setProfile(p => ({ ...p, followers: following ? p.followers.filter(id => id !== (user.id || user._id)) : [...(p.followers || []), user.id || user._id] }));
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!profile) return <div className="text-center py-20"><p className="text-slate-500">User not found</p></div>;

  const avatarUrl = profile.avatar ? `http://localhost:5000${profile.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=0ea5e9&color=fff&bold=true&size=128`;
  const totalLikes = posts.reduce((s, p) => s + (p.likes?.length || 0), 0);
  const totalViews = posts.reduce((s, p) => s + (p.views || 0), 0);
  const isOwn = user && (user.id === profile._id || user._id === profile._id);

  return (
    <>
      <Helmet><title>{profile.name} — EchoBoard</title></Helmet>

      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center">
          <img src={avatarUrl} alt={profile.name} className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-white/20 shadow-xl" />
          <h1 className="text-3xl font-serif font-bold text-white mb-1">{profile.name}</h1>
          <p className="text-slate-400 mb-3">@{profile.username}</p>
          {profile.bio && <p className="text-slate-300 max-w-lg mx-auto text-sm mb-4 leading-relaxed">{profile.bio}</p>}
          <div className="flex items-center justify-center gap-2 text-sm text-slate-400 mb-6">
            <FiCalendar size={14} />
            <span>Joined {moment(profile.createdAt).format('MMMM YYYY')}</span>
          </div>
          <div className="flex items-center justify-center gap-8 mb-6">
            {[
              { val: posts.length, label: 'Posts' },
              { val: profile.followers?.length || 0, label: 'Followers' },
              { val: profile.following?.length || 0, label: 'Following' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{val}</p>
                <p className="text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
          {!isOwn && user && (
            <button onClick={handleFollow} className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition-all ${following ? 'bg-white/20 text-white border border-white/30 hover:bg-white/30' : 'bg-primary-600 text-white hover:bg-primary-700 shadow-lg'}`}>
              {following ? <><FiUserCheck size={15} /> Following</> : <><FiUserPlus size={15} /> Follow</>}
            </button>
          )}
          {isOwn && <Link to="/dashboard" className="btn-secondary text-sm py-2 bg-white/10 border-white/20 text-white hover:bg-white/20">Edit Profile</Link>}
        </div>
      </div>

      {/* Stats bar */}
      <div className="bg-white border-b border-slate-100 py-5">
        <div className="max-w-5xl mx-auto px-4 flex justify-center gap-10">
          {[
            { icon: FiHeart, val: totalLikes, label: 'Likes received' },
            { icon: FiEye, val: totalViews, label: 'Total views' },
            { icon: FiBookOpen, val: posts.length, label: 'Stories published' },
          ].map(({ icon: Icon, val, label }) => (
            <div key={label} className="flex items-center gap-2 text-sm text-slate-600">
              <Icon size={16} className="text-primary-500" />
              <strong className="font-bold text-slate-900">{val}</strong>
              <span className="text-slate-400 hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">Published Stories</h2>
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => <PostCard key={post._id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-16 text-slate-400">
            <FiBookOpen size={36} className="mx-auto mb-3 opacity-40" />
            <p>No public posts yet</p>
          </div>
        )}
      </div>
    </>
  );
}
