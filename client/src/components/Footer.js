import React from 'react';
import { Link } from 'react-router-dom';
import { FiBookOpen, FiTwitter, FiGithub, FiLinkedin, FiInstagram, FiMail, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
                <FiBookOpen className="text-white text-lg" />
              </div>
              <span className="text-xl font-serif font-bold text-white">EchoBoard</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              A modern platform for writers, thinkers, and creators to share their stories with the world.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: FiTwitter, href: 'https://twitter.com' },
                { icon: FiGithub, href: 'https://github.com' },
                { icon: FiLinkedin, href: 'https://linkedin.com' },
                { icon: FiInstagram, href: 'https://instagram.com' },
              ].map(({ icon: Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-primary-600 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[['Explore Posts', '/'], ['Start Writing', '/create'], ['Sign In', '/login'], ['Create Account', '/register']].map(([label, path]) => (
                <li key={path}><Link to={path} className="text-sm text-slate-400 hover:text-white transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Popular Topics</h4>
            <div className="flex flex-wrap gap-2">
              {['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Art', 'Science'].map(tag => (
                <Link key={tag} to={`/?category=${tag}`} className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full transition-colors">
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-sm text-slate-400 mb-4">Get the best stories delivered to your inbox weekly.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="your@email.com" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-primary-500" />
              <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-medium transition-colors">
                <FiMail size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} EchoBoard. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            Developed with <FiHeart size={12} className="text-red-400" /> by <span className="text-slate-300 font-semibold">Akriti</span>
          </p>
          <div className="flex gap-4">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <button key={item} onClick={() => {}} className="text-xs text-slate-500 hover:text-slate-300 transition-colors bg-transparent border-0 cursor-pointer p-0">{item}</button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
