
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { DiseaseType } from '../types';
import { analyzeMedicalReport, predictFromManualData } from '../geminiService';

const Predictor: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const diseaseParam = searchParams.get('d');
  
  const [activeDisease, setActiveDisease] = useState<DiseaseType>(DiseaseType.DIABETES);
  const [mode, setMode] = useState<'upload' | 'manual'>('upload');
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigate('/auth');
      } else {
        setAuthLoading(false);
      }
    });

    if (diseaseParam) {
      const p = diseaseParam.toLowerCase();
      if (p.includes('diabetes')) setActiveDisease(DiseaseType.DIABETES);
      else if (p.includes('heart')) setActiveDisease(DiseaseType.HEART);
      else if (p.includes('kidney')) setActiveDisease(DiseaseType.KIDNEY);
      else if (p.includes('liver')) setActiveDisease(DiseaseType.LIVER);
      else if (p.includes('brain')) setActiveDisease(DiseaseType.BRAIN_TUMOR);
    }

    return () => unsubscribe();
  }, [diseaseParam, navigate]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Explicitly validate file type for PDF and common images
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError("Unsupported file format. Please upload a PDF or an Image (JPG, PNG).");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      
      reader.onload = async () => {
        try {
          const resultAsDataURL = reader.result as string;
          const base64Data = resultAsDataURL.split(',')[1];
          
          if (!base64Data) {
            throw new Error("Failed to process file data.");
          }

          console.log(`Analyzing document (${file.type}) for ${activeDisease}...`);
          const result = await analyzeMedicalReport(base64Data, file.type, activeDisease);
          
          const history = JSON.parse(localStorage.getItem('predict_history') || '[]');
          localStorage.setItem('predict_history', JSON.stringify([{...result, id: Date.now().toString(), date: new Date().toISOString()}, ...history]));
          
          setLoading(false);
          navigate('/results', { state: { result } });
        } catch (err: any) {
          console.error("Analysis error:", err);
          setError(err.message || "AI Analysis failed. Ensure the document contains clear clinical markers.");
          setLoading(false);
        }
      };

      reader.onerror = (err) => {
        console.error("FileReader error:", err);
        setError("Error reading the file. Please try again.");
        setLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Unexpected error:", err);
      setError("An unexpected error occurred during processing.");
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    formData.forEach((value, key) => data[key] = value.toString());

    try {
      const result = await predictFromManualData(data, activeDisease);
      
      const history = JSON.parse(localStorage.getItem('predict_history') || '[]');
      localStorage.setItem('predict_history', JSON.stringify([{...result, id: Date.now().toString(), date: new Date().toISOString()}, ...history]));
      
      setLoading(false);
      navigate('/results', { state: { result } });
    } catch (err) {
      setError("Prediction service timed out. Please verify your clinical data and try again.");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#1977cc]/20 border-t-[#1977cc] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500 font-medium">Verifying Session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Diagnostic Center</h1>
          <p className="text-slate-500">Input your clinical parameters based on official medical datasets.</p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {Object.values(DiseaseType).map((d) => (
            <button
              key={d}
              onClick={() => { setActiveDisease(d); setError(null); }}
              className={`px-5 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-all ${
                activeDisease === d 
                ? 'bg-[#1977cc] text-white shadow-lg ring-2 ring-[#1977cc]/20' 
                : 'bg-white text-slate-500 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2rem] shadow-2xl shadow-blue-900/5 overflow-hidden border border-gray-100">
          <div className="flex border-b border-gray-100">
            <button 
              onClick={() => setMode('upload')}
              className={`flex-1 py-6 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${mode === 'upload' ? 'text-[#1977cc] border-b-2 border-[#1977cc] bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-gray-50'}`}
            >
              <i className="fas fa-file-pdf mr-2 opacity-70"></i> Report AI Extraction
            </button>
            <button 
              onClick={() => setMode('manual')}
              className={`flex-1 py-6 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 ${mode === 'manual' ? 'text-[#1977cc] border-b-2 border-[#1977cc] bg-blue-50/30' : 'text-slate-400 hover:text-slate-600 hover:bg-gray-50'}`}
            >
              <i className="fas fa-edit mr-2 opacity-70"></i> Manual Parameters
            </button>
          </div>

          <div className="p-8 md:p-14">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <div className="relative w-24 h-24 mb-10">
                  <div className="absolute inset-0 border-4 border-[#1977cc]/10 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#1977cc] border-t-transparent rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-file-medical text-[#1977cc] text-2xl animate-pulse"></i>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Analyzing Clinical Record...</h3>
                <p className="text-slate-500 text-center max-w-sm">
                  Our medical AI is parsing markers from your {activeDisease === DiseaseType.BRAIN_TUMOR ? 'MRI scan' : 'lab report'}...
                </p>
              </div>
            ) : mode === 'upload' ? (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center hover:border-[#1977cc] hover:bg-blue-50/20 transition-all duration-500 group cursor-pointer relative overflow-hidden">
                  <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    <i className="fas fa-file-pdf text-4xl text-[#1977cc]"></i>
                  </div>
                  <h4 className="text-2xl font-bold text-slate-900 mb-3">Upload PDF or Medical Image</h4>
                  <p className="text-slate-500 mb-10 max-w-sm mx-auto leading-relaxed">
                    Select your PDF lab report or scan image for <span className="text-[#1977cc] font-semibold">{activeDisease}</span> prediction.
                  </p>
                  <label className="bg-[#1977cc] text-white px-12 py-4 rounded-2xl cursor-pointer hover:bg-[#3fbbc0] hover:shadow-xl hover:shadow-[#1977cc]/20 transition-all font-bold shadow-lg inline-block active:scale-95">
                    Select Report (PDF/Image)
                    <input type="file" className="hidden" onChange={handleFileUpload} accept="application/pdf,image/*" />
                  </label>
                  <p className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest font-bold">PDF, PNG, or JPG • Max 10MB</p>
                </div>
                {error && (
                  <div className="bg-red-50 border border-red-100 text-red-600 p-5 rounded-2xl flex items-start space-x-3 animate-shake">
                    <i className="fas fa-exclamation-triangle mt-1"></i>
                    <div>
                      <p className="text-sm font-bold">Analysis Failed</p>
                      <p className="text-xs opacity-80">{error}</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Age</label>
                    <input type="number" name="age" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#1977cc]/20 outline-none transition-all" placeholder="Years" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                    <select name="gender" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-[#1977cc]/20 outline-none transition-all">
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>

                  {activeDisease === DiseaseType.DIABETES && (
                    <>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Pregnancies</label><input type="number" name="pregnancies" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Glucose</label><input type="number" name="glucose" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Blood Pressure</label><input type="number" name="bp" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">BMI</label><input type="number" step="0.1" name="bmi" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Insulin</label><input type="number" name="insulin" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                    </>
                  )}

                  {activeDisease === DiseaseType.HEART && (
                    <>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Chest Pain (0-3)</label><input type="number" name="cp" min="0" max="3" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Cholesterol</label><input type="number" name="chol" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Max Heart Rate</label><input type="number" name="thalach" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Oldpeak</label><input type="number" step="0.1" name="oldpeak" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" /></div>
                    </>
                  )}

                  {activeDisease === DiseaseType.BRAIN_TUMOR && (
                    <>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Headache Intensity</label><input type="number" name="headache" min="1" max="10" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4" placeholder="1-10 Scale" /></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Seizures</label><select name="seizures" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"><option value="no">None</option><option value="yes">Frequent</option></select></div>
                      <div className="space-y-2"><label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Vision Status</label><select name="vision" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4"><option value="normal">Normal</option><option value="blurred">Blurred</option><option value="double">Double</option></select></div>
                    </>
                  )}
                </div>
                <button type="submit" className="w-full bg-[#1977cc] text-white py-6 rounded-[1.5rem] font-bold shadow-2xl shadow-[#1977cc]/30 hover:bg-[#3fbbc0] hover:-translate-y-1 transition-all active:scale-[0.98]">
                  Predict <span className="uppercase">{activeDisease}</span> Risk
                </button>
                {error && <p className="text-red-500 text-center font-bold text-sm bg-red-50 p-4 rounded-xl">{error}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Predictor;
