import { getInterviewById } from "@/lib/actions/general.action";
import { getCurrentUser } from "@/lib/actions/auth.action";
import Agent from "@/components/Agent";
import DisplayTechIcons from "@/components/DisplayTechIcons";
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
    <section className="px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        {/* Left */}
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold capitalize">
            {interview.role} Interview
          </h1>

          <DisplayTechIcons techStack={interview.techstack} />
        </div>

        {/* Right */}
        <div className="bg-[#2b2b3d] px-4 py-2 rounded-full">
          <p className="capitalize text-sm text-white">
            {interview.type}
          </p>
        </div>
      </div>

      {/* Interview Agent */}
      <Agent
        userName={user?.name || "User"}
        userId={user?.id || ""}
        interviewId={id}
        questions={interview.questions}
        type="interview"
      />
    </section>
  );
}