"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  frontendCandidates,
  backendCandidates,
  type Candidate,
} from "@/lib/data/candidates";

type Part = "FRONTEND" | "BACKEND";

export default function CandidatesPage() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<Part>("FRONTEND");

  const candidates =
    selectedPart === "FRONTEND" ? frontendCandidates : backendCandidates;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => router.back()} className="mr-3">
          <Image
            src="/images/login/back.svg"
            alt="back"
            width={10}
            height={18}
          />
        </button>
        <h1 className="text-xl font-semibold">Members</h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-4 px-6 py-4">
        <button
          onClick={() => setSelectedPart("FRONTEND")}
          className={`flex-1 py-3 text-base font-semibold rounded transition-all ${
            selectedPart === "FRONTEND"
              ? "bg-black text-white"
              : "bg-white text-gray-700 border-2 border-gray-300"
          }`}
        >
          Front-End
        </button>
        <button
          onClick={() => setSelectedPart("BACKEND")}
          className={`flex-1 py-3 text-base font-semibold rounded transition-all ${
            selectedPart === "BACKEND"
              ? "bg-black text-white"
              : "bg-white text-gray-700 border-2 border-gray-300"
          }`}
        >
          Back-End
        </button>
      </div>
      
      {/* 후보자들 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="grid grid-cols-2 gap-4">
          {candidates.map((candidate) => (
            <CandidateCard
              key={candidate.id}
              candidate={candidate}
              onClick={() => router.push(`/candidates/${candidate.id}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function CandidateCard({
  candidate,
  onClick,
}: {
  candidate: Candidate;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border-2 border-gray-200 rounded p-4 hover:shadow-md hover:border-gray-300 transition-all"
    >
      <div className="flex flex-col items-center gap-2">
        {/* 후보자 이미지 */}
        <div className="w-16 h-16 rounded-full overflow-hidden flex items-center justify-center">
          <Image
            src={candidate.image}
            alt={candidate.name}
            width={64}
            height={64}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/candidates/profile.svg";
            }}
          />
        </div>

        {/* 후보자 이름 */}
        <h3 className="text-base font-semibold text-gray-900">
          {candidate.name}
        </h3>

        {/* 팀명 */}
        <p className="text-sm text-gray-600">{candidate.team}</p>
      </div>
    </button>
  );
}
