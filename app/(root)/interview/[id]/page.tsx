import { getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  const interview = await getInterviewById(id);
  const user = await getCurrentUser();

  if (!interview) {
    notFound();
  }

  return (
    <Agent
  userName={user?.name || "User"}
  userId={user?.id || ""}
  interviewId={id}
  questions={interview.questions}
  type="interview"
/>
  );
}