
import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";



export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } =
    await request.json();

    

  try {
    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${process.env.GOOGLE_GENERATIVE_AI_API_KEY}`,
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ],
    }),
  }
);

if (!response.ok) {
  const error = await response.text();
  throw new Error(error);
}

const data = await response.json();

const text =
  data.candidates?.[0]?.content?.parts?.[0]?.text ?? "[]";
    console.log("Gemini returned:");
console.log(text);

   const cleanedText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  console.log("Gemini Response:");
console.log(text);

const questions = JSON.parse(cleanedText);

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