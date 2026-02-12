
export enum DiseaseType {
  DIABETES = 'Diabetes',
  HEART = 'Heart Disease',
  KIDNEY = 'Chronic Kidney Disease',
  LIVER = 'Indian Liver Patient',
  BRAIN_TUMOR = 'Brain Tumor Detection'
}

export interface PredictionResult {
  id?: string;
  date?: string;
  disease: DiseaseType;
  riskScore: number; // 0-100
  diagnosis: string;
  isPositive: boolean;
  explanation: {
    feature: string;
    impact: number;
    description: string;
  }[];
  recommendations: string[];
}

export interface UserProfile {
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'admin';
  joinedDate: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}
