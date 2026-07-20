import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import InterviewCard from "@/components/InterviewCard";

import { getCurrentUser } from "@/lib/actions/auth.action";
import {
  getLatestInterviews,
  getInterviewsByUserId,
} from "@/lib/actions/general.action";

const Home = async () => {
  const user = await getCurrentUser();

  const userInterviews = await getInterviewsByUserId(user!.id);

  const recentUserInterviews = userInterviews?.slice(0, 6);

  const latestInterviews = await getLatestInterviews({
    userId: user!.id,
  });

  const recentLatestInterviews = latestInterviews?.slice(0, 6);

  return (
    <>
      {/* Hero Section */}
      <section className="card-cta">
        <div className="flex flex-col gap-6 max-w-lg">
          <h2>Get Interview-Ready with AI-Powered Practice & Feedback</h2>

          <p className="text-lg">
            Practice real interview questions & get instant feedback.
          </p>

          <Button asChild className="btn-primary max-sm:w-full">
            <Link href="/interview">Start an Interview</Link>
          </Button>
        </div>

        <Image
          src="/robot.png"
          alt="robo-dude"
          width={400}
          height={400}
          className="max-sm:hidden"
        />
      </section>

      {/* Your Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2>Your Interviews</h2>

          {userInterviews && userInterviews.length > 6 && (
            <Link
              href="/my-interviews"
              className="text-primary-200 hover:underline"
            >
              View All →
            </Link>
          )}
        </div>

        <div className="interviews-section">
          {recentUserInterviews?.map((interview) => (
            <InterviewCard
              key={interview.id}
              userId={interview.userId}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
        </div>
      </section>

      {/* Take Interviews */}
      <section className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between">
          <h2>Take Interviews</h2>

          {latestInterviews && latestInterviews.length > 6 && (
            <Link
              href="/interviews"
              className="text-primary-200 hover:underline"
            >
              View All →
            </Link>
          )}
        </div>

        <div className="interviews-section">
          {recentLatestInterviews?.map((interview) => (
            <InterviewCard
              key={interview.id}
              userId={interview.userId}
              interviewId={interview.id}
              role={interview.role}
              type={interview.type}
              techstack={interview.techstack}
              createdAt={interview.createdAt}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;