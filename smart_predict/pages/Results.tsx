import React, { useEffect, useState } from 'react';
import { useLocation, Link, Navigate, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PredictionResult } from '../types';
import jsPDF from 'jspdf'; // ✅ ADDED

const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result as PredictionResult;
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth');
      } else {
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // ✅ ADDED — DOWNLOAD PDF (USES EXISTING DATA)
  const handleDownloadReport = () => {
    if (!result) return;

    const pdf = new jsPDF('p', 'mm', 'a4');

    pdf.setFontSize(16);
    pdf.text('SmartPredict – AI Health Assessment Report', 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Test: ${result.disease}`, 20, 40);
    pdf.text(`Risk Probability: ${result.riskScore}%`, 20, 50);
    pdf.text(`Result: ${result.isPositive ? 'Positive' : 'Negative'}`, 20, 60);

    pdf.text('Diagnosis:', 20, 80);
    pdf.text(result.diagnosis, 20, 90, { maxWidth: 170 });

    pdf.text('Explainable AI Insights (SHAP):', 20, 120);
    result.explanation.forEach((item, index) => {
      pdf.text(
        `• ${item.feature}: ${Math.round(item.impact * 100)}%`,
        25,
        135 + index * 8
      );
    });

    pdf.text(
      'Note: This is an AI-generated report. Please consult a medical professional.',
      20,
      200,
      { maxWidth: 170 }
    );

    pdf.save('SmartPredict_Report.pdf');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1977cc]/20 border-t-[#1977cc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Securing Report...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return <Navigate to="/predict" />;
  }

  const chartData = result.explanation.map(item => ({
    name: item.feature,
    impact: Math.round(item.impact * 100)
  }));

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 70) return 'text-orange-500';
    return 'text-red-500';
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Main Result Card */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <div className="flex justify-between items-start mb-10">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-2">Diagnosis Summary</h2>
                  <p className="text-slate-500">Verified AI health assessment</p>
                </div>

                {/* ✅ ONLY BUTTON CHANGE */}
                <button
                  onClick={handleDownloadReport}
                  className="p-3 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors text-slate-600"
                >
                  <i className="fas fa-file-pdf mr-2"></i> Download Report
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="text-center p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
                    Risk Probability
                  </h4>
                  <div className="relative inline-block">
                    <svg className="w-32 h-32 transform -rotate-90">
                      <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-200" />
                      <circle
                        cx="64"
                        cy="64"
                        r="58"
                        stroke="currentColor"
                        strokeWidth="12"
                        fill="transparent"
                        strokeDasharray={364.4}
                        strokeDashoffset={364.4 - (364.4 * result.riskScore / 100)}
                        className={`${getRiskColor(result.riskScore)} transition-all duration-1000 ease-out`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-3xl font-bold text-slate-800">
                        {result.riskScore}%
                      </span>
                    </div>
                  </div>
                  <p className={`mt-4 font-bold ${getRiskColor(result.riskScore)}`}>
                    {result.riskScore < 30
                      ? 'Low Risk'
                      : result.riskScore < 70
                      ? 'Moderate Risk'
                      : 'High Risk'}
                  </p>
                </div>

                <div className="p-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className={`w-3 h-3 rounded-full ${result.isPositive ? 'bg-red-500' : 'bg-green-500'}`}></span>
                    <h4 className="text-xl font-bold text-slate-900">
                      Result: {result.isPositive ? 'Positive' : 'Negative'}
                    </h4>
                  </div>
                  <p className="text-slate-600 leading-relaxed italic border-l-4 border-slate-200 pl-4">
                    "{result.diagnosis}"
                  </p>
                </div>
              </div>

              {/* SHAP */}
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-6">
                  Explainable AI Insights (SHAP)
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal vertical={false} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" width={120} />
                      <Tooltip />
                      <Bar dataKey="impact" radius={[0, 4, 4, 0]}>
                        {chartData.map((entry, index) => (
                          <Cell key={index} fill={entry.impact > 0 ? '#f87171' : '#4ade80'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <h3 className="text-xl font-bold text-slate-900 mb-6">
                AI Lifestyle Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.recommendations.map((rec, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-2xl">
                    {rec}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gradient-to-br from-[#1977cc] to-[#3fbbc0] rounded-3xl p-8 text-white shadow-xl">
              <h3 className="text-2xl font-bold mb-4">Take Action Now</h3>
              <p className="text-sm opacity-90 mb-8">
                Your diagnostic results are now stored securely.
              </p>
              <Link
                to="/appointments"
                state={{ result }}
                className="block w-full text-center bg-white text-[#1977cc] py-4 rounded-xl font-bold"
              >
                Book Specialist Consult
              </Link>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-xl border border-blue-50">
              <h3 className="text-lg font-bold mb-4">Patient Information</h3>
              <ul className="space-y-2">
                <li><b>Test:</b> {result.disease}</li>
                <li><b>Date:</b> {new Date().toLocaleDateString()}</li>
                <li><b>Model:</b> SmartPredict v3.0</li>
                <li><b>Status:</b> <span className="text-green-500">Verified Analysis</span></li>
              </ul>
            </div>

            <Link to="/predict" className="block w-full text-center border-2 py-4 rounded-xl">
              New Prediction
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Results;
