
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Predictor from './pages/Predictor';
import Results from './pages/Results';
import Appointments from './pages/Appointments';
import Admin from './pages/Admin';
import Auth from './pages/Auth';
import Profile from './pages/Profile';

const App: React.FC = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/predict" element={<Predictor />} />
          <Route path="/results" element={<Results />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
