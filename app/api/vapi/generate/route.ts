import { GoogleGenAI } from "@google/genai";
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } =
    await request.json();

    

  try {
    const prompt = `
Prepare ${amount} interview questions.

Role: ${role}
Experience Level: ${level}
Tech Stack: ${techstack}
Interview Type: ${type}

Return ONLY a JSON array.

Example:
[
 "Question 1",
 "Question 2",
 "Question 3"
]
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    const text = response.text ?? "[]";

    const questions = JSON.parse(text);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

return Response.json({
  success: true,
  interviewId: docRef.id,
  data: interview,
  },
  { status: 200 }
);
  } catch (err) {
    console.error(err);

    return Response.json(
      {
        success: false,
        error: String(err),
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json({
    hello: "world",
  });
}