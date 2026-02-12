
import { GoogleGenAI, Type } from "@google/genai";
import { DiseaseType, PredictionResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeMedicalReport = async (
  fileData: string, 
  mimeType: string, 
  targetDisease: DiseaseType
): Promise<PredictionResult> => {
  const model = "gemini-3-flash-preview"; // Multimodal capable
  
  const prompt = `
    You are a medical AI diagnostic assistant. Analyze this ${mimeType === 'application/pdf' ? 'report' : 'scan'} for ${targetDisease} risk.
    
    1. Extract clinical markers (HbA1c, Cholesterol, Glucose, MRI visual markers, etc.)
    2. Compare with Kaggle/UCI medical dataset thresholds.
    3. Return a risk score (0-100) and SHAP-like feature impacts.
    
    IMPORTANT: You must return ONLY strictly valid JSON. No markdown backticks.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            { text: prompt },
            { inlineData: { data: fileData, mimeType } }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            diagnosis: { type: Type.STRING },
            isPositive: { type: Type.BOOLEAN },
            explanation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  impact: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["disease", "riskScore", "diagnosis", "isPositive", "explanation", "recommendations"]
        }
      }
    });

    const text = response.text.trim();
    // Safety check for common LLM markdown formatting
    const cleanedJson = text.startsWith('```') ? text.replace(/^```json/, '').replace(/```$/, '') : text;
    return JSON.parse(cleanedJson) as PredictionResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const predictFromManualData = async (
  formData: Record<string, string>,
  targetDisease: DiseaseType
): Promise<PredictionResult> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the clinical data for ${targetDisease} risk assessment:
    ${JSON.stringify(formData)}
    
    Simulate a diagnostic model trained on Kaggle/UCI medical datasets.
    Return risk score (0-100), diagnosis, and SHAP feature importance.
    
    ONLY return strictly valid JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            disease: { type: Type.STRING },
            riskScore: { type: Type.NUMBER },
            diagnosis: { type: Type.STRING },
            isPositive: { type: Type.BOOLEAN },
            explanation: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  feature: { type: Type.STRING },
                  impact: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                }
              }
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          }
        }
      }
    });

    return JSON.parse(response.text.trim()) as PredictionResult;
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    throw error;
  }
};
