"use client";

import { useRouter } from "next/navigation";

import { useState } from "react";

const Page = () => {
  const [role, setRole] = useState("");
  const [type, setType] = useState("technical");
  const [level, setLevel] = useState("junior");
  const [techstack, setTechstack] = useState("");
  const [amount, setAmount] = useState(5);
  const router = useRouter();

  const handleGenerate = async () => {
  try {
    const response = await fetch("/api/vapi/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role,
        type,
        level,
        techstack,
        amount,
        userid: "WWvGfcGpkZgEqegqJRuuEsFOdip1", // temporary
      }),
    });

    const data = await response.json();

console.log(data);

if (data.success) {
  alert("Interview Generated Successfully!");

  router.push(`/interview/${data.interviewId}`);
} else {
  alert("Failed to generate interview");
}
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-[#111] p-8 rounded-xl border border-gray-700">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Interview Generation
      </h1>

      {/* Role */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Role</label>

        <input
          type="text"
          placeholder="Eg.Frontend Developer"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        />
      </div>

      {/* Interview Type */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Interview Type</label>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        >
          <option value="technical">Technical</option>
          <option value="behavioral">Behavioral</option>
          <option value="mixed">Mixed</option>
        </select>
      </div>

      {/* Experience */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Experience Level</label>

        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        >
          <option value="junior">Junior</option>
          <option value="mid">Mid</option>
          <option value="senior">Senior</option>
        </select>
      </div>

      {/* Tech Stack */}
      <div className="mb-5">
        <label className="block mb-2 font-semibold">Tech Stack</label>

        <input
          type="text"
          placeholder="React, Next.js, TypeScript"
          value={techstack}
          onChange={(e) => setTechstack(e.target.value)}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        />
      </div>

      {/* Questions */}
      <div className="mb-8">
        <label className="block mb-2 font-semibold">
          Number of Questions
        </label>

        <input
          type="number"
          min={1}
          max={20}
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="w-full p-3 rounded-lg bg-black border border-gray-600"
        />
      </div>

      <button
  onClick={handleGenerate}
  className="w-full bg-green-600 hover:bg-green-700 rounded-lg p-3 font-semibold"
>
  Generate Interview
</button>
    </div>
  );
};

export default Page;