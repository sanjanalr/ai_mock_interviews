"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

import { vapi } from "@/lib/vapi.sdk";
import { createFeedback } from "@/lib/actions/general.action";
enum CallStatus {
  INACTIVE = "INACTIVE",
  CONNECTING = "CONNECTING",
  ACTIVE = "ACTIVE",
  FINISHED = "FINISHED",
}

const Agent = ({
  userName,
  userId,
  type,
  questions,
  interviewId,
}: AgentProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
const [transcript, setTranscript] = useState("");
const router = useRouter();
const [messages, setMessages] = useState<any[]>([]);
const [callStatus, setCallStatus] = useState<CallStatus>(
  CallStatus.INACTIVE
);

 useEffect(() => {
  const onCallStart = () => {
    console.log("Call Started");
    setCallStatus(CallStatus.ACTIVE);
  };

  
  
 const onCallEnd = () => {
  console.log("Call Ended");

  setCallStatus(CallStatus.FINISHED);
  setIsSpeaking(false);
};

  const onSpeechStart = () => {
    console.log("Speech Started");
    setIsSpeaking(true);
  };

  const onSpeechEnd = () => {
    console.log("Speech Ended");
    setIsSpeaking(false);
  };

 
const onMessage = (message: any) => {
  console.log("MESSAGE TYPE:", message.type);
console.log(message);

  if (
    message?.type === "transcript" &&
    message?.transcriptType === "final"
  ) {
    setTranscript(message.transcript);

    // Save transcript
    setMessages((prev) => [
      ...prev,
      {
        role: message.role,
        content: message.transcript,
      },
    ]);

    // Auto end
    if (message.role === "user") {
      const text = message.transcript.toLowerCase();

      // if (
      //   text.includes("thank you") ||
      //   text.includes("thanks") ||
      //   text.includes("bye") ||
      //   text.includes("goodbye") ||
      //   text.includes("i am done") ||
      //   text.includes("end interview")
      // ) {
      //   vapi.stop();
      // }
    }
  }
};

 
  const onError = (error: any) => {
    console.log("Vapi Error:", error);
  };

  vapi.on("call-start", onCallStart);
  vapi.on("call-end", onCallEnd);
  vapi.on("speech-start", onSpeechStart);
  vapi.on("speech-end", onSpeechEnd);
  vapi.on("message", onMessage);
  vapi.on("error", onError);

  return () => {
    vapi.off("call-start", onCallStart);
    vapi.off("call-end", onCallEnd);
    vapi.off("speech-start", onSpeechStart);
    vapi.off("speech-end", onSpeechEnd);
    vapi.off("message", onMessage);
    vapi.off("error", onError);
  };
}, []);



const handleGenerateFeedback = async (messages: any[]) => {
  console.log("Messages being sent:");
console.log(messages);

  const { success, feedbackId } = await createFeedback({
  interviewId: interviewId!,
  userId: userId!,
  transcript: messages,
});

if (success && feedbackId) {
  router.push(`/interview/${interviewId}/feedback`);
} else {
  console.error("Error saving feedback");
  router.push("/");
}
};

useEffect(() => {
  if (callStatus === CallStatus.FINISHED) {
    if (type === "generate") {
      router.push("/");
    } else {
      handleGenerateFeedback(messages);
    }
  }
}, [messages, callStatus, type, router, interviewId, userId]);

const startCall = async () => {
  try {
    setCallStatus(CallStatus.CONNECTING);

    // Generate page
    if (type === "generate") {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "mixed",
          role: "frontend",
          level: "senior",
          techstack: "next.js",
          amount: "7",
          userid: userId,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        alert("Interview generation failed");
        setCallStatus(CallStatus.INACTIVE);
        return;
      }

      // Go to interview page
      window.location.href = `/interview/${data.interviewId}`;
      return;
    }

    // Interview page
  if (type === "interview") {
  console.log("Starting interview...");
  console.log("Questions:", questions);

  let formattedQuestions = "";

  if (questions) {
    formattedQuestions = questions
      .map((question) => `- ${question}`)
      .join("\n");
  }

  

 await vapi.start(
  process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID!,
  {
    variableValues: {
      username: userName,
      questions: formattedQuestions,
    },
  }
);

  console.log("Interview started");
}
  } catch (error) {
    console.error(error);
    setCallStatus(CallStatus.INACTIVE);
  }
};

const endCall = () => {
  vapi.stop();
  setCallStatus(CallStatus.FINISHED);
};

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
          <p>{transcript || "Click Call to start your interview."}</p>
        </div>
      </div>

      <div className="w-full flex justify-center">
        {callStatus !== CallStatus.ACTIVE ? (
  <button className="btn-call" onClick={startCall}>
    {callStatus === CallStatus.CONNECTING ? "..." : "Call"}
  </button>
) : (
  <button className="btn-disconnect" onClick={endCall}>
    End
  </button>
)}
      </div>
    </>
  );
};

export default Agent;