import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

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

Return ONLY a valid JSON array.

Example:

[
  "Question 1",
  "Question 2",
  "Question 3"
]
`;

    const { text } = await generateText({
      model: google("gemini-3.5-flash"),
      prompt,
    });

    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const questions = JSON.parse(cleanedText);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(",").map((item: string) => item.trim()),
      questions,
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    const docRef = await db.collection("interviews").add(interview);

    return Response.json(
      {
        success: true,
        interviewId: docRef.id,
        data: interview,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Generate Interview Error:", err);

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