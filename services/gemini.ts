
import { GoogleGenAI, Type } from "@google/genai";
import { MeasurementPoint } from "../types";

export async function extractMeasurementPoints(imageData: string): Promise<MeasurementPoint[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        {
          text: `Analyze this industrial control chart (Carta de Controle) and extract the measurement points (Pontos de Medição). 
          Identify the Nominal value, Plus Tolerance, and Minus Tolerance for each point.
          Return the data in a clean JSON format. P1, P2, etc.`
        },
        {
          inlineData: {
            data: imageData.split(',')[1],
            mimeType: 'image/png'
          }
        }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING, description: "ID of the point (e.g., P1)" },
            label: { type: Type.STRING, description: "Description or label" },
            nominal: { type: Type.NUMBER },
            tolerancePlus: { type: Type.NUMBER },
            toleranceMinus: { type: Type.NUMBER }
          },
          required: ["id", "nominal", "tolerancePlus", "toleranceMinus"]
        }
      }
    }
  });

  try {
    const jsonStr = response.text || "[]";
    return JSON.parse(jsonStr) as MeasurementPoint[];
  } catch (error) {
    console.error("Failed to parse Gemini response", error);
    return [];
  }
}

export async function aiValidateMeasurements(points: MeasurementPoint[]): Promise<{ points: MeasurementPoint[], overall: 'APROVADO' | 'REPROVADO', analysis: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Atue como Engenheiro Sênior de Qualidade da Panasonic. 
    Realize uma validação preliminar técnica das seguintes medições industriais.
    
    DADOS:
    ${JSON.stringify(points.map(p => ({ 
      id: p.id, 
      label: p.label, 
      nominal: p.nominal, 
      plus: p.tolerancePlus, 
      minus: p.toleranceMinus, 
      measured: p.measured 
    })))}
    
    REQUISITOS:
    1. Verifique se cada valor medido está dentro dos limites (Nominal + Plus / Nominal - Minus).
    2. Forneça um status individual para cada ID.
    3. Determine o veredito geral do lote.
    4. Escreva uma análise técnica curta (justificativa) sobre a precisão observada.
    
    RETORNE ESTRITAMENTE EM JSON.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          points: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                status: { type: Type.STRING, enum: ["APROVADO", "REPROVADO", "PENDENTE"] }
              }
            }
          },
          overall: { type: Type.STRING, enum: ["APROVADO", "REPROVADO"] },
          analysis: { type: Type.STRING, description: "Justificativa técnica da IA sobre o lote" }
        },
        required: ["points", "overall", "analysis"]
      }
    }
  });

  try {
    const result = JSON.parse(response.text || "{}");
    const updatedPoints = points.map(p => {
      const aiPoint = result.points.find((ap: any) => ap.id === p.id);
      return { ...p, status: aiPoint?.status || 'PENDENTE' };
    });

    return { 
      points: updatedPoints, 
      overall: result.overall, 
      analysis: result.analysis 
    };
  } catch (error) {
    console.error("AI Validation failed", error);
    // Fallback to local logic if AI fails
    return validateMeasurements(points);
  }
}

export async function validateMeasurements(points: MeasurementPoint[]): Promise<{ points: MeasurementPoint[], overall: 'APROVADO' | 'REPROVADO', analysis: string }> {
  const updatedPoints: MeasurementPoint[] = points.map(p => {
    if (p.measured === undefined) return { ...p, status: 'PENDENTE' as const };
    const upperLimit = p.nominal + p.tolerancePlus;
    const lowerLimit = p.nominal - p.toleranceMinus;
    const status: 'APROVADO' | 'REPROVADO' = (p.measured >= lowerLimit && p.measured <= upperLimit) ? 'APROVADO' : 'REPROVADO';
    return { ...p, status };
  });

  const overall = updatedPoints.some(p => p.status === 'REPROVADO') ? 'REPROVADO' : 'APROVADO';
  const analysis = overall === 'APROVADO' 
    ? "Todas as dimensões críticas estão em conformidade com as especificações de engenharia." 
    : "Detectadas inconsistências em dimensões críticas. O lote requer inspeção 100% ou contenção.";
  
  return { points: updatedPoints, overall, analysis };
}
