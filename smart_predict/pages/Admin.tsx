
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Admin: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const ADMIN_EMAIL = 'admin@smartpredict.com';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user || user.email !== ADMIN_EMAIL) {
        navigate('/'); // Redirect non-admins to home
      } else {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const data = [
    { name: 'Mon', count: 400 },
    { name: 'Tue', count: 300 },
    { name: 'Wed', count: 600 },
    { name: 'Thu', count: 800 },
    { name: 'Fri', count: 500 },
    { name: 'Sat', count: 900 },
    { name: 'Sun', count: 700 },
  ];

  const stats = [
    { label: 'Total Users', value: '12,450', icon: 'fa-users', color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'AI Predictions', value: '45,200', icon: 'fa-robot', color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Active Doctors', value: '84', icon: 'fa-user-md', color: 'text-teal-500', bg: 'bg-teal-50' },
    { label: 'Success Rate', value: '98.4%', icon: 'fa-check-circle', color: 'text-green-500', bg: 'bg-green-50' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1977cc]/20 border-t-[#1977cc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Verifying Administrator Access...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Command Center</h1>
            <p className="text-slate-500">Monitoring platform diagnostics and system performance.</p>
          </div>
          <div className="flex space-x-3 mt-4 md:mt-0">
            <button className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-semibold hover:bg-gray-50">
              Export CSV
            </button>
            <button className="px-4 py-2 bg-[#1977cc] text-white rounded-lg text-sm font-semibold hover:bg-[#3fbbc0]">
              Update Models
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center text-xl`}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <span className="text-green-500 text-xs font-bold">+12%</span>
              </div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl border border-blue-50">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-slate-900">Weekly Prediction Volume</h3>
              <select className="bg-slate-50 border-none text-sm font-semibold rounded-lg px-3 py-2 text-slate-500">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
              </select>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1977cc" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#1977cc" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                  />
                  <Area type="monotone" dataKey="count" stroke="#1977cc" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-50">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Diagnoses</h3>
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map((item) => (
                <div key={item} className="flex items-center space-x-4 border-b border-slate-50 pb-4 last:border-0">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <i className="fas fa-file-medical text-sm"></i>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-800">Kidney Risk Analysis</h4>
                    <p className="text-xs text-slate-400">Patient ID: #44023 • 12 mins ago</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-600 rounded-lg">Success</span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 text-sm font-bold text-[#1977cc] hover:bg-blue-50 rounded-xl transition-colors">
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
