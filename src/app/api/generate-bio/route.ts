import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { personalDetails, educationDetails, familyDetails } = await req.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const prompt = `Write a warm, professional, and authentic "About Me" paragraph for a matrimonial biodata. 
Keep it to 3–4 sentences (60–80 words). Write in first person. Focus on personality, values and life aspirations.
Do NOT include religious platitudes or clichés like "I am a simple person".

Details:
- Name: ${personalDetails.fullName}
- Age: ${personalDetails.dateOfBirth ? new Date().getFullYear() - new Date(personalDetails.dateOfBirth).getFullYear() : 'not given'}
- Occupation: ${educationDetails.occupation || 'professional'}
- Education: ${educationDetails.highestEducation || 'graduate'}
- Diet: ${personalDetails.diet || 'vegetarian'}
- Family type: ${familyDetails.familyType || 'nuclear'}

Write only the paragraph, no labels or titles.`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.8, maxOutputTokens: 150 },
        }),
      }
    );

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    return NextResponse.json({ bio: text.trim() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate bio' }, { status: 500 });
  }
}
