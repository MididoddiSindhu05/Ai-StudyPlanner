import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const getAIStudyPlan = async (subjects: string[], goals: string[], examDates: Record<string, string>) => {
  try {
    const prompt = `Act as an expert academic advisor. Create a detailed, optimized study plan for a student with these subjects: ${subjects.join(', ')}. 
    Their goals are: ${goals.join(', ')}. 
    Upcoming exams: ${JSON.stringify(examDates)}.
    
    Format the response as a JSON object with this structure:
    {
      "title": "Strategy Name",
      "description": "Short overview",
      "schedule": [
        {
          "day": "Monday",
          "slots": [
            { "time": "09:00 - 10:30", "subject": "Subject Name", "activity": "Specific task" }
          ]
        }
      ],
      "recommendations": ["Tip 1", "Tip 2"]
    }
    Only return raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};

export const getAIRecommendation = async (recentActivities: any[]) => {
  const prompt = `Based on these recent study sessions: ${JSON.stringify(recentActivities)}, 
  provide 3 short, motivational, and actionable study tips to improve productivity. 
  Return as a JSON array of strings.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
    }
  });

  return JSON.parse(response.text || '[]');
};

export const getAIChatResponse = async (message: string, context: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Context: You are a helpful study assistant. ${context}\n\nUser: ${message}`,
  });
  return response.text;
};

export const synthesizeGoal = async (broadGoal: string) => {
  try {
    const prompt = `Act as a high-performance productivity coach. Break down this broad goal into 4-6 specific, highly actionable tasks that a student can execute immediately.
    
    Broad Goal: "${broadGoal}"
    
    Format the response as a JSON array of objects, where each object has:
    - "title": A concise, clear task title.
    - "subject": The academic or skill domain it belongs to.
    - "priority": Either "High", "Medium", or "Low".
    
    Only return raw JSON.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Goal Synthesis Error:", error);
    return [];
  }
};
