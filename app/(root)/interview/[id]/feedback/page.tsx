import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

import {
  getFeedbackByInterviewId,
  getInterviewById,
} from "@/lib/actions/general.action";

import { getCurrentUser } from "@/lib/actions/auth.action";

const Feedback = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  const interview = await getInterviewById(id);

  if (!interview) redirect("/");

  const feedback = await getFeedbackByInterviewId({
    interviewId: id,
    userId: user.id,
  });

  if (!feedback) {
    return (
      <section className="section-feedback">
        <h1 className="text-3xl font-bold">Feedback not found</h1>

        <Link href="/">
          <button className="btn-primary mt-8">
            Back to Dashboard
          </button>
        </Link>
      </section>
    );
  }

  return (
    <section className="section-feedback">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">
          Feedback -{" "}
          <span className="capitalize">
            {interview.role}
          </span>{" "}
          Interview
        </h1>
      </div>

      <div className="flex justify-center mt-6">
        <div className="flex gap-8">

          <div className="flex items-center gap-2">
            <Image
              src="/star.svg"
              alt="star"
              width={22}
              height={22}
            />

            <p>
              Overall Score :
              <span className="font-bold text-primary-200">
                {" "}
                {feedback.totalScore}/100
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Image
              src="/calendar.svg"
              alt="calendar"
              width={22}
              height={22}
            />

            <p>
              {dayjs(feedback.createdAt).format(
                "MMM D, YYYY h:mm A"
              )}
            </p>
          </div>
        </div>
      </div>

      <hr className="my-8" />

      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">
          Final Assessment
        </h2>

        <p>{feedback.finalAssessment}</p>
      </div>

      <div className="mt-10 space-y-5">
        <h2 className="text-2xl font-semibold">
          Interview Breakdown
        </h2>

        {feedback.categoryScores.map(
          (category: any, index: number) => (
            <div key={index}>
              <h3 className="font-semibold">
                {index + 1}. {category.name} (
                {category.score}/100)
              </h3>

              <p>{category.comment}</p>
            </div>
          )
        )}
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">
          Strengths
        </h2>

        <ul className="list-disc ml-6 mt-4">
          {feedback.strengths.map(
            (item: string, index: number) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold">
          Areas for Improvement
        </h2>

        <ul className="list-disc ml-6 mt-4">
          {feedback.areasForImprovement.map(
            (item: string, index: number) => (
              <li key={index}>{item}</li>
            )
          )}
        </ul>
      </div>

      <div className="flex gap-6 mt-12">

        <Link href="/" className="flex-1">
          <button className="btn-secondary w-full">
            Back to Dashboard
          </button>
        </Link>

        <Link
          href={`/interview/${id}`}
          className="flex-1"
        >
          <button className="btn-primary w-full">
            Retake Interview
          </button>
        </Link>

      </div>
    </section>
  );
};

export default Feedback;