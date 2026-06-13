import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import moment from 'moment';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { FiTrash2, FiSlash, FiCheckCircle, FiShield, FiSearch, FiUser } from 'react-icons/fi';

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/admin/users').then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their posts?`)) return;
    await api.delete(`/admin/users/${id}`);
    setUsers(p => p.filter(u => u._id !== id));
    toast.success('User deleted');
  };

  const handleRestrict = async (id) => {
    const { data } = await api.put(`/admin/users/${id}/restrict`);
    setUsers(p => p.map(u => u._id === id ? { ...u, isRestricted: data.isRestricted } : u));
    toast.success(data.message);
  };

  const handlePromote = async (id) => {
    if (!window.confirm('Promote this user to admin?')) return;
    const { data } = await api.put(`/admin/users/${id}/promote`);
    setUsers(p => p.map(u => u._id === id ? { ...u, role: data.role } : u));
    toast.success('User promoted to admin');
  };

  const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet><title>Manage Users — Admin</title></Helmet>
      <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-slate-900">Manage Users</h1>
          <p className="text-sm text-slate-500">{users.length} total users</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
          <input type="text" placeholder="Search users..." value={search} onChange={e => setSearch(e.target.value)} className="input-field pl-9 py-2.5 text-sm" />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-14 bg-slate-100 rounded-xl animate-pulse" />)}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {['User', 'Email', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar ? `http://localhost:5000${u.avatar}` : `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0ea5e9&color=fff&bold=true&size=36`} alt={u.name} className="w-9 h-9 rounded-xl object-cover flex-shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">@{u.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.role === 'admin' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">{moment(u.createdAt).format('MMM DD, YYYY')}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${u.isRestricted ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                        {u.isRestricted ? 'Restricted' : 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {u._id !== me._id && u._id !== (me.id) && (
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => handleRestrict(u._id)} title={u.isRestricted ? 'Unrestrict' : 'Restrict'}
                            className={`p-2 rounded-lg transition-all ${u.isRestricted ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-orange-50 text-orange-500 hover:bg-orange-100'}`}>
                            {u.isRestricted ? <FiCheckCircle size={14} /> : <FiSlash size={14} />}
                          </button>
                          {u.role !== 'admin' && (
                            <button onClick={() => handlePromote(u._id)} title="Promote to Admin" className="p-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition-all">
                              <FiShield size={14} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(u._id, u.name)} title="Delete user" className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-all">
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <FiUser size={28} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
