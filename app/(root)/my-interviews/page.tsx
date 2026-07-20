import InterviewCard from "@/components/InterviewCard";
import { getCurrentUser } from "@/lib/actions/auth.action";
import { getInterviewsByUserId } from "@/lib/actions/general.action";

const MyInterviewsPage = async () => {
  const user = await getCurrentUser();

  const interviews = await getInterviewsByUserId(user!.id);

  return (
    <section className="flex flex-col gap-8">
      <h1 className="text-4xl font-bold">My Interviews</h1>

      <div className="interviews-section">
        {interviews?.map((interview) => (
          <InterviewCard
            key={interview.id}
            interviewId={interview.id}
            userId={interview.userId}
            role={interview.role}
            type={interview.type}
            techstack={interview.techstack}
            createdAt={interview.createdAt}
          />
        ))}
      </div>
    </section>
  );
};

export default MyInterviewsPage;