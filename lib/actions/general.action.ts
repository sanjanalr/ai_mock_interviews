"use server";

import { GoogleGenAI } from "@google/genai";

import { db } from "@/firebase/admin";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}`
      )
      .join("\n");

    const prompt = `
You are a professional technical interviewer.

Analyze the interview transcript below.

Transcript:
${formattedTranscript}

Return ONLY valid JSON.

Use EXACTLY this format:

{
  "totalScore": 85,
  "categoryScores": [
    {
      "name": "Communication Skills",
      "score": 90,
      "comment": "..."
    },
    {
      "name": "Technical Knowledge",
      "score": 82,
      "comment": "..."
    },
    {
      "name": "Problem-Solving",
      "score": 80,
      "comment": "..."
    },
    {
      "name": "Cultural & Role Fit",
      "score": 88,
      "comment": "..."
    },
    {
      "name": "Confidence & Clarity",
      "score": 86,
      "comment": "..."
    }
  ],
  "strengths": [
    "...",
    "...",
    "..."
  ],
  "areasForImprovement": [
    "...",
    "...",
    "..."
  ],
  "finalAssessment": "..."
}

Do NOT wrap the JSON inside markdown.
Do NOT return explanations.
Return ONLY JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    let text = response.text ?? "";

    // Remove markdown if Gemini adds it
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    console.log("Gemini Feedback:");
    console.log(text);

    const object = JSON.parse(text);

    const feedback = {
      interviewId,
      userId,
      totalScore: object.totalScore,
      categoryScores: object.categoryScores,
      strengths: object.strengths,
      areasForImprovement: object.areasForImprovement,
      finalAssessment: object.finalAssessment,
      createdAt: new Date().toISOString(),
    };

    let feedbackRef;

    if (feedbackId) {
      feedbackRef = db.collection("feedback").doc(feedbackId);
    } else {
      feedbackRef = db.collection("feedback").doc();
    }

    await feedbackRef.set(feedback);

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error) {
    console.error("Error saving feedback:", error);

    return {
      success: false,
    };
  }
}

export async function getInterviewById(
  id: string
): Promise<Interview | null> {
  const interview = await db.collection("interviews").doc(id).get();

  return interview.data() as Interview | null;
}

export async function getFeedbackByInterviewId(
  params: GetFeedbackByInterviewIdParams
): Promise<Feedback | null> {
  const { interviewId, userId } = params;

  const querySnapshot = await db
    .collection("feedback")
    .where("interviewId", "==", interviewId)
    .where("userId", "==", userId)
    .limit(1)
    .get();

  if (querySnapshot.empty) return null;

  const feedbackDoc = querySnapshot.docs[0];

  return {
    id: feedbackDoc.id,
    ...feedbackDoc.data(),
  } as Feedback;
}

export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}