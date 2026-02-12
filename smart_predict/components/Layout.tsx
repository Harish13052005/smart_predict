
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../firebase';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'admin@smartpredict.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Predict', path: '/predict' },
    { name: 'Appointments', path: '/appointments' },
  ];

  const filteredLinks = isAdmin 
    ? [...navLinks, { name: 'Admin', path: '/admin' }]
    : navLinks;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-10 h-10 bg-[#1977cc] rounded-lg flex items-center justify-center">
                  <i className="fas fa-stethoscope text-white text-xl"></i>
                </div>
                <span className="text-2xl font-bold text-[#1977cc] tracking-tight">Smart<span className="text-slate-800">Predict</span></span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {filteredLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`${isActive(link.path) ? 'text-[#1977cc] border-b-2 border-[#1977cc]' : 'text-slate-600 hover:text-[#1977cc]'} px-1 py-2 text-sm font-bold transition-colors`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100 hover:bg-blue-100 transition-colors">
                    <div className="w-7 h-7 bg-[#1977cc] rounded-full flex items-center justify-center text-xs text-white font-bold">
                      {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-bold text-slate-700 truncate max-w-[100px]">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </Link>
                  <button onClick={handleSignOut} title="Sign Out" className="text-slate-400 hover:text-red-500 transition-colors">
                    <i className="fas fa-sign-out-alt"></i>
                  </button>
                </div>
              ) : (
                <Link to="/auth" className="bg-[#1977cc] text-white px-6 py-2 rounded-full hover:bg-[#3fbbc0] transition-all font-bold">
                  Sign In
                </Link>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-slate-600">
                <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`}></i>
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4 space-y-2">
            {filteredLinks.map((link) => (
              <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 rounded-md text-base font-bold text-slate-700">
                {link.name}
              </Link>
            ))}
            {user && (
              <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block px-3 py-2 text-blue-600 font-bold">My Profile</Link>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">{children}</main>

      <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-[#1977cc] rounded flex items-center justify-center text-white"><i className="fas fa-stethoscope"></i></div>
                <span className="text-xl font-bold text-white tracking-tight">SmartPredict</span>
              </div>
              <p className="text-sm">Advanced clinical-grade AI diagnostics platform.</p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-6">Quick Links</h3>
              <ul className="space-y-4 text-sm">
                <li><Link to="/predict">New Diagnosis</Link></li>
                <li><Link to="/profile">Health History</Link></li>
                <li><Link to="/appointments">My Consultations</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-xs">
            <p>&copy; 2024 SmartPredict. Clinical Data Verified.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
