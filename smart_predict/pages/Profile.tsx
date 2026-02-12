
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../firebase';
import { PredictionResult } from '../types';

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'appointments' | 'settings'>('profile');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate('/auth');
      } else {
        setUser(currentUser);
        const storedHistory = JSON.parse(localStorage.getItem('predict_history') || '[]');
        setHistory(storedHistory);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-[#1977cc] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Display Name</p>
                <p className="text-lg font-semibold text-slate-800 border-b border-slate-50 pb-2">{user?.displayName || 'Not Set'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Email Address</p>
                <p className="text-lg font-semibold text-slate-800 border-b border-slate-50 pb-2">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Account Status</p>
                <p className="text-lg font-semibold text-green-500 border-b border-slate-50 pb-2">Verified Patient</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-400 uppercase">Member Since</p>
                <p className="text-lg font-semibold text-slate-800 border-b border-slate-50 pb-2">
                  {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
            <button className="mt-10 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors">
              Update Information
            </button>
          </div>
        );
      case 'history':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-900">Health History</h3>
              <p className="text-sm text-slate-500">{history.length} records found</p>
            </div>
            {history.length > 0 ? (
              <div className="space-y-4">
                {history.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-[#1977cc] transition-all">
                    <div className="flex items-center space-x-6">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${item.isPositive ? 'bg-red-400' : 'bg-green-400'}`}>
                        <i className={`fas ${item.isPositive ? 'fa-exclamation-triangle' : 'fa-check-circle'}`}></i>
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{item.disease}</h4>
                        <p className="text-xs text-slate-400">{new Date(item.date || '').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-slate-800">{item.riskScore}% Risk</div>
                      <div className={`text-xs font-bold uppercase tracking-widest ${item.isPositive ? 'text-red-500' : 'text-green-500'}`}>
                        {item.isPositive ? 'High Risk' : 'Healthy'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <i className="fas fa-folder-open text-4xl text-slate-200 mb-4 block"></i>
                <p className="text-slate-500">No prediction history yet.</p>
              </div>
            )}
          </div>
        );
      case 'appointments':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Upcoming Appointments</h3>
            <div className="p-12 border-2 border-dashed border-slate-100 rounded-3xl text-center">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="fas fa-calendar-alt text-[#1977cc] text-xl"></i>
              </div>
              <p className="text-slate-400 mb-6">You have no scheduled consultations.</p>
              <button onClick={() => navigate('/appointments')} className="bg-[#1977cc] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-[#3fbbc0] transition-colors">
                Book a Specialist
              </button>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 animate-fadeIn">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">Platform Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Email Notifications</h4>
                  <p className="text-xs text-slate-500">Receive reports and appointment reminders via email.</p>
                </div>
                <div className="w-12 h-6 bg-green-500 rounded-full relative cursor-pointer">
                  <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                <div>
                  <h4 className="font-bold text-slate-800">Two-Factor Authentication</h4>
                  <p className="text-xs text-slate-500">Secure your medical data with 2FA.</p>
                </div>
                <button className="text-[#1977cc] font-bold text-sm">Enable</button>
              </div>
              <div className="pt-6 border-t border-slate-100">
                <button className="text-red-500 font-bold text-sm flex items-center">
                  <i className="fas fa-trash mr-2"></i> Delete Account
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center">
              <div className="w-24 h-24 bg-[#1977cc] rounded-full mx-auto mb-6 flex items-center justify-center text-3xl text-white font-bold shadow-inner">
                {user?.displayName?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{user?.displayName || 'Patient'}</h2>
              <p className="text-sm text-slate-500 mb-6 truncate">{user?.email}</p>
              <div className="pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">Diagnoses</p>
                  <p className="text-lg font-bold text-[#1977cc]">{history.length}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase font-bold">Status</p>
                  <p className="text-lg font-bold text-green-500">Active</p>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full px-6 py-4 flex items-center space-x-4 transition-all border-l-4 ${activeTab === 'profile' ? 'bg-blue-50 text-[#1977cc] font-bold border-[#1977cc]' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
              >
                <i className="fas fa-user-circle"></i>
                <span>General Profile</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`w-full px-6 py-4 flex items-center space-x-4 transition-all border-l-4 ${activeTab === 'history' ? 'bg-blue-50 text-[#1977cc] font-bold border-[#1977cc]' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
              >
                <i className="fas fa-history"></i>
                <span>Health History</span>
              </button>
              <button 
                onClick={() => setActiveTab('appointments')}
                className={`w-full px-6 py-4 flex items-center space-x-4 transition-all border-l-4 ${activeTab === 'appointments' ? 'bg-blue-50 text-[#1977cc] font-bold border-[#1977cc]' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
              >
                <i className="fas fa-calendar-check"></i>
                <span>My Appointments</span>
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`w-full px-6 py-4 flex items-center space-x-4 transition-all border-l-4 ${activeTab === 'settings' ? 'bg-blue-50 text-[#1977cc] font-bold border-[#1977cc]' : 'text-slate-600 hover:bg-slate-50 border-transparent'}`}
              >
                <i className="fas fa-cog"></i>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {renderTabContent()}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
