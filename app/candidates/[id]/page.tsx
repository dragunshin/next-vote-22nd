"use client";

import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { getCandidateById } from "@/lib/data/candidates";

export default function CandidateDetailPage() {
  const router = useRouter();
  const params = useParams();
  const candidateId = params.id as string;

  const candidate = getCandidateById(candidateId);

  if (!candidate) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <p className="text-gray-600">후보자를 찾을 수 없습니다.</p>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2 bg-black text-white rounded"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex items-center px-6 py-4">
        <button onClick={() => router.back()} className="mr-3">
          <Image
            src="/images/login/back.svg"
            alt="back"
            width={10}
            height={18}
          />
        </button>
        <h1 className="text-xl font-semibold">후보자 정보</h1>
      </header>

      {/* 후보자들 */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {/* 후보자 이미지 */}
        <div className="w-full aspect-square max-w-md mx-auto mb-6 rounded-lg overflow-hidden flex items-center justify-center">
          <Image
            src={candidate.image}
            alt={candidate.name}
            width={400}
            height={400}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/images/candidates/profile.svg";
            }}
          />
        </div>

        {/* 후보자 기본 정보 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-2xl font-bold">{candidate.name}</h2>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
              {candidate.team}
            </span>
          </div>
          <p className="text-gray-600">
            {candidate.part === "FRONTEND" ? "Front-End" : "Back-End"} 파트
          </p>
        </div>

        {/* 소개 */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">후보자 소개</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {candidate.introduction}
            </p>
          </div>
        </div>

        {/* 투표하기 버튼 */}
        <button
          onClick={() => router.push("/vote")}
          className="w-full h-14 bg-black text-white font-semibold rounded hover:bg-gray-800 transition-colors"
        >
          투표하러 가기
        </button>
      </div>
    </div>
  );
}
