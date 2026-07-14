"use client";

import Image from "next/image";

const Agent = ({ userName }: AgentProps) => {
  const isSpeaking = true;

  return (
    <>
      <div className="call-view">
        <div className="card-interviewer">
          <div className="avatar">
            <Image
              src="/ai-avatar.png"
              alt="AI"
              width={65}
              height={54}
              className="object-cover"
            />
            {isSpeaking && <span className="animate-speak" />}
          </div>

          <h3>AI Interviewer</h3>
        </div>

        <div className="card-border">
          <div className="card-content">
            <Image
              src="/user-avatar-new.png" // use your image name
              alt="User"
              width={120}
              height={120}
              className="rounded-full object-cover size-[120px]"
            />

            <h3>{userName}</h3>
          </div>
        </div>
      </div>

      <div className="transcript-border">
        <div className="transcript">
          <p>My name is John Doe, nice to meet you!</p>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button className="btn-call">
          Call
        </button>
      </div>
    </>
  );
};

export default Agent;