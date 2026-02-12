
import React from 'react';
import { Link } from 'react-router-dom';
import { DiseaseType } from '../types';

const Home: React.FC = () => {
  const services = [
    { 
      type: DiseaseType.DIABETES, 
      icon: 'fa-droplet', 
      desc: 'Predict risk using BMI, Glucose, and HbA1c data.',
      color: 'bg-red-50 text-red-500'
    },
    { 
      type: DiseaseType.HEART, 
      icon: 'fa-heart-pulse', 
      desc: 'Advanced analysis of cardiac markers and vital signs.',
      color: 'bg-pink-50 text-pink-500'
    },
    { 
      type: DiseaseType.KIDNEY, 
      icon: 'fa-lungs', 
      desc: 'Screening for CKD using urea, creatinine, and albumin.',
      color: 'bg-blue-50 text-blue-500'
    },
    { 
      type: DiseaseType.LIVER, 
      icon: 'fa-vial-medical', 
      desc: 'Liver function test analysis using bilirubin and proteins.',
      color: 'bg-orange-50 text-orange-500'
    },
    { 
      type: DiseaseType.BRAIN_TUMOR, 
      icon: 'fa-brain', 
      desc: 'Deep learning MRI scan analysis for early detection.',
      color: 'bg-indigo-50 text-indigo-500'
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-40 bg-gradient-to-br from-[#1977cc]/5 to-[#3fbbc0]/10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 bg-white px-4 py-1.5 rounded-full shadow-sm border border-blue-100 mb-6">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#1977cc]"></span>
              </span>
              <span className="text-sm font-medium text-slate-600">SmartPredict AI 3.0 Live Now</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-8">
              AI-Powered <span className="text-[#1977cc]">Early Detection</span> for Smarter Healthcare
            </h1>
            <p className="text-lg text-slate-600 mb-10 leading-relaxed mx-auto max-w-2xl">
              Bridge the gap between diagnosis and treatment with our multi-disease prediction platform. 
              Utilizing state-of-the-art AI to interpret clinical reports and MRI scans with precision.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Link to="/predict" className="bg-[#1977cc] text-white px-8 py-4 rounded-xl shadow-lg hover:shadow-[#1977cc]/20 hover:scale-105 transition-all font-semibold text-lg flex items-center">
                Get Prediction <i className="fas fa-arrow-right ml-3"></i>
              </Link>
              <Link to="/appointments" className="bg-white text-slate-800 border border-slate-200 px-8 py-4 rounded-xl hover:bg-slate-50 transition-all font-semibold text-lg">
                Book Appointment
              </Link>
            </div>
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <img key={i} src={`https://picsum.photos/seed/${i+10}/100/100`} className="w-10 h-10 rounded-full border-2 border-white" alt="Doctor" />
                ))}
              </div>
              <p className="text-sm text-slate-500">
                <span className="text-slate-900 font-semibold">10,000+</span> patients analyzed this month
              </p>
            </div>
          </div>
        </div>
        {/* Background blobs for depth without specific imagery */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-teal-200/20 rounded-full blur-3xl"></div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-16">
            <h2 className="text-blue-500 font-bold tracking-widest uppercase text-sm mb-4">Diagnosis Modules</h2>
            <h3 className="text-4xl font-bold text-slate-900">Multi-Disease Diagnostic Platform</h3>
            <div className="w-20 h-1 bg-[#1977cc] mx-auto mt-6"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 text-left">
                <div className={`w-14 h-14 ${service.color} rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform`}>
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-3">{service.type}</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  {service.desc} Powered by explainable AI (SHAP) for transparent diagnosis.
                </p>
                <Link 
                  to={`/predict?d=${service.type.toLowerCase().split(' ')[0]}`}
                  className="inline-flex items-center text-[#1977cc] font-semibold text-sm hover:underline"
                >
                  Check Now <i className="fas fa-arrow-right ml-2 text-xs"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Replaces How It Works visuals */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-8 leading-tight">
              Clinical Grade Precision
            </h2>
            <p className="text-lg text-slate-600 mb-12">
              Our platform is built on validated clinical datasets and verified by healthcare professionals. 
              We prioritize data privacy and result transparency through advanced explainable AI techniques.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-50">
                <div className="text-3xl text-[#1977cc] mb-4"><i className="fas fa-shield-alt"></i></div>
                <h4 className="font-bold text-slate-900 mb-2">Secure</h4>
                <p className="text-sm text-slate-500">HIPAA compliant data processing.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-50">
                <div className="text-3xl text-[#1977cc] mb-4"><i className="fas fa-microscope"></i></div>
                <h4 className="font-bold text-slate-900 mb-2">Validated</h4>
                <p className="text-sm text-slate-500">Trained on UCI & Kaggle datasets.</p>
              </div>
              <div className="p-6 bg-white rounded-2xl shadow-sm border border-blue-50">
                <div className="text-3xl text-[#1977cc] mb-4"><i className="fas fa-brain"></i></div>
                <h4 className="font-bold text-slate-900 mb-2">Explainable</h4>
                <p className="text-sm text-slate-500">Transparent AI decision logic.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
