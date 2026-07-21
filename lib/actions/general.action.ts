"use server";

import { generateText } from "ai";
import { google } from "@ai-sdk/google";

import { db } from "@/firebase/admin";
import { feedbackSchema } from "@/constants";

export async function createFeedback(params: CreateFeedbackParams) {
  const { interviewId, userId, transcript, feedbackId } = params;

  try {
    const formattedTranscript = transcript
      .map(
        (sentence: { role: string; content: string }) =>
          `- ${sentence.role}: ${sentence.content}`
      )
      .join("\n");

      console.log(
  "Gemini Key Prefix:",
  process.env.GOOGLE_GENERATIVE_AI_API_KEY?.slice(0, 15)
);
    const { text } = await generateText({
      model: google("gemini-3.5-flash"),

      prompt: `
You are an experienced technical interviewer.

Analyze the following interview transcript.

Transcript:
${formattedTranscript}

Return ONLY valid JSON.

Format:

{
  "totalScore":90,
  "categoryScores":[
    {
      "name":"Communication Skills",
      "score":90,
      "comment":"Excellent communication."
    },
    {
      "name":"Technical Knowledge",
      "score":88,
      "comment":"Strong technical understanding."
    },
    {
      "name":"Problem-Solving",
      "score":86,
      "comment":"Logical approach."
    },
    {
      "name":"Cultural & Role Fit",
      "score":90,
      "comment":"Good role fit."
    },
    {
      "name":"Confidence & Clarity",
      "score":89,
      "comment":"Confident throughout."
    }
  ],
  "strengths":[
    "..."
  ],
  "areasForImprovement":[
    "..."
  ],
  "finalAssessment":"..."
}

Return ONLY JSON.
`,
    });

    const object = JSON.parse(
      text.replace(/```json/g, "").replace(/```/g, "").trim()
    );

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

    const feedbackRef = feedbackId
      ? db.collection("feedback").doc(feedbackId)
      : db.collection("feedback").doc();

    await feedbackRef.set(feedback);

    return {
      success: true,
      feedbackId: feedbackRef.id,
    };
  } catch (error: any) {
  console.error("Error saving feedback:", error);

  return {
    success: false,
    error: error?.message ?? "Failed to generate feedback.",
  };
}
}


export async function getInterviewById(
  id: string
): Promise<Interview | null> {
  console.log("Fetching interview:", id);

  const doc = await db.collection("interviews").doc(id).get();

  console.log("Document exists:", doc.exists);

  if (!doc.exists) {
    return null;
  }

  console.log("Interview data:", doc.data());

  return {
    id: doc.id,
    ...doc.data(),
  } as Interview;
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