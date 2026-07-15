import { db } from "@/firebase/admin";
import { getRandomInterviewCover } from "@/lib/utils";

export async function POST(request: Request) {
  const { type, role, level, techstack, amount, userid } =
    await request.json();

  try {
    // Temporary mock questions until Gemini quota is available
    const questions = JSON.stringify([
      "Tell me about yourself.",
      "What are the main features of Next.js?",
      "Explain React Hooks.",
      "What is Server Side Rendering?",
      "What is the difference between useState and useEffect?",
      "Describe a challenging frontend bug you solved.",
      "Why should we hire you?"
    ]);

    const interview = {
      role,
      type,
      level,
      techstack: techstack.split(","),
      questions: JSON.parse(questions),
      userId: userid,
      finalized: true,
      coverImage: getRandomInterviewCover(),
      createdAt: new Date().toISOString(),
    };

    await db.collection("interviews").add(interview);

    return Response.json(
      {
        success: true,
        data: interview,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        success: false,
        error,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return Response.json(
    {
      success: true,
      data: "Thank you!",
    },
    { status: 200 }
  );
}