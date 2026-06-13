import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import toast from 'react-hot-toast';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import {
  FiHeart, FiEye, FiShare2, FiEdit2, FiTrash2, FiLock, FiGlobe,
  FiMessageCircle, FiSend, FiChevronLeft, FiClock,
  FiUser, FiCornerDownRight, FiX
} from 'react-icons/fi';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&q=80';

export default function PostDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([api.get(`/posts/${id}`), api.get(`/comments/${id}`)])
      .then(([postRes, commentsRes]) => {
        setPost(postRes.data);
        setLikeCount(postRes.data.likes?.length || 0);
        setLiked(user ? postRes.data.likes?.includes(user.id || user._id) : false);
        setComments(commentsRes.data);
      })
      .catch(() => toast.error('Post not found'))
      .finally(() => setLoading(false));
  }, [id, user]);

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to like posts');
    const { data } = await api.post(`/posts/${id}/like`);
    setLiked(data.liked);
    setLikeCount(data.likes);
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post permanently?')) return;
    await api.delete(`/posts/${id}`);
    toast.success('Post deleted');
    navigate('/dashboard');
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await api.post(`/comments/${id}`, {
        content: commentText,
        parentComment: replyTo?._id || null,
      });
      if (replyTo) {
        setComments(prev => prev.map(c => c._id === replyTo._id ? { ...c, replies: [...(c.replies || []), data] } : c));
      } else {
        setComments(prev => [{ ...data, replies: [] }, ...prev]);
      }
      setCommentText('');
      setReplyTo(null);
      toast.success('Comment posted!');
    } catch {
      toast.error('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId, isReply, parentId) => {
    await api.delete(`/comments/${commentId}`);
    if (isReply) {
      setComments(prev => prev.map(c => c._id === parentId ? { ...c, replies: c.replies.filter(r => r._id !== commentId) } : c));
    } else {
      setComments(prev => prev.filter(c => c._id !== commentId));
    }
    toast.success('Comment deleted');
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="h-10 bg-slate-200 rounded-xl w-3/4 mb-6" />
      <div className="h-80 bg-slate-200 rounded-2xl mb-8" />
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => <div key={i} className="h-4 bg-slate-200 rounded-full" />)}
      </div>
    </div>
  );

  if (!post) return null;

  const isOwner = user && (user.id === post.author?._id || user._id === post.author?._id);
  const imageUrl = post.coverImage ? `http://localhost:5000${post.coverImage}` : PLACEHOLDER;
  const authorAvatar = post.author?.avatar
    ? `http://localhost:5000${post.author.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true`;

  return (
    <>
      <Helmet><title>{post.title} — EchoBoard</title></Helmet>

      <div className="bg-white min-h-screen">
        {/* Hero Image */}
        <div className="relative h-72 md:h-96 lg:h-[480px] overflow-hidden">
          <img src={imageUrl} alt={post.title} className="w-full h-full object-cover" onError={e => { e.target.src = PLACEHOLDER; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Back button */}
          <button onClick={() => navigate(-1)} className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all text-sm font-medium">
            <FiChevronLeft size={16} /> Back
          </button>

          {/* Meta badges */}
          <div className="absolute top-6 right-6 flex gap-2">
            {post.category && <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full">{post.category}</span>}
            <span className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${post.visibility === 'private' ? 'bg-slate-900/80 text-white' : 'bg-emerald-500/80 text-white'}`}>
              {post.visibility === 'private' ? <FiLock size={11} /> : <FiGlobe size={11} />}
              {post.visibility}
            </span>
          </div>

          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl md:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-4">
                {post.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <Link to={`/profile/${post.author?.username}`} className="flex items-center gap-2 hover:text-white transition-colors">
                  <img src={authorAvatar} alt={post.author?.name} className="w-8 h-8 rounded-full object-cover" />
                  <span className="font-semibold">{post.author?.name}</span>
                </Link>
                <span className="flex items-center gap-1"><FiClock size={13} /> {moment(post.createdAt).format('MMM DD, YYYY')}</span>
                <span className="flex items-center gap-1"><FiEye size={13} /> {post.views} views</span>
                <span className="flex items-center gap-1"><FiHeart size={13} /> {likeCount} likes</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Actions Bar */}
          <div className="flex items-center justify-between mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${liked ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-white text-slate-600 border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200'}`}>
                <FiHeart size={16} className={liked ? 'fill-current' : ''} /> {likeCount}
              </button>
              <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-slate-100 font-semibold text-sm transition-all">
                <FiShare2 size={16} /> Share
              </button>
            </div>
            {(isOwner || user?.role === 'admin') && (
              <div className="flex items-center gap-2">
                <Link to={`/edit/${post._id}`} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-600 border border-slate-200 hover:bg-primary-50 hover:text-primary-600 hover:border-primary-200 font-semibold text-sm transition-all">
                  <FiEdit2 size={15} /> Edit
                </Link>
                <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-red-500 border border-red-100 hover:bg-red-50 font-semibold text-sm transition-all">
                  <FiTrash2 size={15} /> Delete
                </button>
              </div>
            )}
          </div>

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map(tag => <span key={tag} className="tag"># {tag}</span>)}
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-slate-900 prose-p:text-slate-700 prose-p:leading-relaxed prose-a:text-primary-600 prose-img:rounded-2xl prose-blockquote:border-primary-400 prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 mb-12"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Card */}
          <div className="bg-gradient-to-br from-slate-50 to-primary-50 rounded-2xl border border-slate-100 p-6 mb-10 flex items-start gap-4">
            <img src={authorAvatar} alt={post.author?.name} className="w-16 h-16 rounded-2xl object-cover shadow-md" />
            <div className="flex-1">
              <Link to={`/profile/${post.author?.username}`} className="text-lg font-serif font-bold text-slate-900 hover:text-primary-600 transition-colors">
                {post.author?.name}
              </Link>
              <p className="text-sm text-slate-500 mb-2">@{post.author?.username}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{post.author?.bio || 'Writer on EchoBoard'}</p>
            </div>
            <Link to={`/profile/${post.author?.username}`} className="btn-secondary text-sm py-2 px-4">
              View Profile
            </Link>
          </div>

          {/* Comments Section */}
          <div className="border-t border-slate-100 pt-10">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
              <FiMessageCircle className="text-primary-500" />
              {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </h3>

            {/* Comment Form */}
            {user ? (
              <form onSubmit={handleComment} className="mb-8">
                {replyTo && (
                  <div className="flex items-center gap-2 text-sm text-primary-600 bg-primary-50 border border-primary-100 rounded-xl px-4 py-2 mb-3">
                    <FiCornerDownRight size={14} />
                    Replying to <strong>{replyTo.author?.name}</strong>
                    <button type="button" onClick={() => setReplyTo(null)} className="ml-auto text-slate-400 hover:text-slate-600">
                      <FiX size={14} />
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <img
                    src={user.avatar ? `http://localhost:5000${user.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0ea5e9&color=fff&bold=true`}
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 flex gap-2">
                    <textarea
                      value={commentText}
                      onChange={e => setCommentText(e.target.value)}
                      placeholder={replyTo ? `Reply to ${replyTo.author?.name}...` : 'Share your thoughts...'}
                      rows={2}
                      className="input-field resize-none text-sm flex-1"
                      required
                    />
                    <button type="submit" disabled={submitting} className="btn-primary px-4 self-end disabled:opacity-60">
                      <FiSend size={16} />
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center mb-8">
                <FiUser size={28} className="text-slate-400 mx-auto mb-2" />
                <p className="text-slate-600 font-medium mb-3">Sign in to join the conversation</p>
                <Link to="/login" className="btn-primary text-sm">Sign In to Comment</Link>
              </div>
            )}

            {/* Comments List */}
            <div className="space-y-5">
              {comments.map(comment => (
                <CommentItem
                  key={comment._id}
                  comment={comment}
                  user={user}
                  onDelete={(cId) => handleDeleteComment(cId, false)}
                  onReply={(c) => { setReplyTo(c); }}
                  onDeleteReply={(rId) => handleDeleteComment(rId, true, comment._id)}
                />
              ))}
            </div>

            {comments.length === 0 && (
              <div className="text-center py-10 text-slate-400">
                <FiMessageCircle size={36} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No comments yet. Be the first!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function CommentItem({ comment, user, onDelete, onReply, onDeleteReply }) {
  const isOwner = user && (user.id === comment.author?._id || user._id === comment.author?._id);
  const canDelete = isOwner || user?.role === 'admin';
  const avatarUrl = comment.author?.avatar
    ? `http://localhost:5000${comment.author.avatar}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=40`;

  return (
    <div className="group">
      <div className="flex gap-3 p-4 bg-white rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors">
        <img src={avatarUrl} alt={comment.author?.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${comment.author?.username}`} className="text-sm font-semibold text-slate-800 hover:text-primary-600">{comment.author?.name}</Link>
              <span className="text-xs text-slate-400">{moment(comment.createdAt).fromNow()}</span>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {user && <button onClick={() => onReply(comment)} className="text-xs text-primary-500 hover:text-primary-700 font-medium flex items-center gap-1"><FiCornerDownRight size={12} /> Reply</button>}
              {canDelete && <button onClick={() => onDelete(comment._id)} className="text-xs text-red-400 hover:text-red-600 font-medium flex items-center gap-1"><FiTrash2 size={12} /> Delete</button>}
            </div>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed">{comment.content}</p>
        </div>
      </div>

      {/* Replies */}
      {comment.replies?.length > 0 && (
        <div className="ml-8 mt-2 space-y-2">
          {comment.replies.map(reply => {
            const rAvatar = reply.author?.avatar ? `http://localhost:5000${reply.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(reply.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=32`;
            const canDeleteReply = user && (user.id === reply.author?._id || user._id === reply.author?._id || user?.role === 'admin');
            return (
              <div key={reply._id} className="flex gap-3 p-3 bg-primary-50/50 rounded-xl border border-primary-100/50 group/reply">
                <img src={rAvatar} alt={reply.author?.name} className="w-7 h-7 rounded-lg object-cover flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2">
                      <Link to={`/profile/${reply.author?.username}`} className="text-xs font-semibold text-slate-800 hover:text-primary-600">{reply.author?.name}</Link>
                      <span className="text-xs text-slate-400">{moment(reply.createdAt).fromNow()}</span>
                    </div>
                    {canDeleteReply && (
                      <button onClick={() => onDeleteReply(reply._id)} className="opacity-0 group-hover/reply:opacity-100 text-xs text-red-400 hover:text-red-600 transition-opacity">
                        <FiTrash2 size={11} />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed">{reply.content}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
