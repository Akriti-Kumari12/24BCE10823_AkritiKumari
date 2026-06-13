import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiEye, FiLock, FiClock } from 'react-icons/fi';
import moment from 'moment';

const PLACEHOLDER = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&q=80';

export default function PostCard({ post, compact = false }) {
  const imageUrl = post.coverImage ? `http://localhost:5000${post.coverImage}` : PLACEHOLDER;

  return (
    <article className="card group">
      <Link to={`/post/${post._id}`} className="block relative overflow-hidden">
        <img
          src={imageUrl}
          alt={post.title}
          className={`w-full object-cover transition-transform duration-500 group-hover:scale-105 ${compact ? 'h-44' : 'h-52'}`}
          onError={e => { e.target.src = PLACEHOLDER; }}
        />
        {post.visibility === 'private' && (
          <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
            <FiLock size={11} /> Private
          </div>
        )}
        {post.category && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
            {post.category}
          </div>
        )}
      </Link>

      <div className="p-5">
        {/* Author */}
        <div className="flex items-center gap-2.5 mb-3">
          <Link to={`/profile/${post.author?.username}`}>
            <img
              src={post.author?.avatar ? `http://localhost:5000${post.author.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(post.author?.name || 'U')}&background=0ea5e9&color=fff&bold=true&size=32`}
              alt={post.author?.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
            />
          </Link>
          <div className="flex-1 min-w-0">
            <Link to={`/profile/${post.author?.username}`} className="text-xs font-semibold text-slate-700 hover:text-primary-600 transition-colors block truncate">
              {post.author?.name}
            </Link>
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <FiClock size={10} />
              {moment(post.createdAt).fromNow()}
            </div>
          </div>
        </div>

        {/* Title */}
        <Link to={`/post/${post._id}`}>
          <h3 className={`font-serif font-bold text-slate-900 hover:text-primary-600 transition-colors leading-snug mb-2 ${compact ? 'text-base line-clamp-2' : 'text-lg line-clamp-2'}`}>
            {post.title}
          </h3>
        </Link>

        {/* Excerpt */}
        {!compact && (
          <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed mb-4">
            {post.excerpt || post.content?.replace(/<[^>]+>/g, '').substring(0, 120)}...
          </p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map(tag => (
              <span key={tag} className="tag"># {tag}</span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiHeart size={13} className="text-rose-400" />
              {post.likes?.length || 0}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-slate-500">
              <FiEye size={13} className="text-sky-400" />
              {post.views || 0}
            </span>
          </div>
          <Link to={`/post/${post._id}`} className="text-xs font-semibold text-primary-600 hover:text-primary-700 transition-colors">
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
