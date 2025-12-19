"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/stores/useAuthStore";
import { authService } from "@/services/auth.service";

type VoteCategory = "frontend" | "backend" | "demo";

const voteCategories = [
  { id: "frontend" as VoteCategory, label: "프론트엔드 파트장 투표" },
  { id: "backend" as VoteCategory, label: "백엔드 파트장 투표" },
  { id: "demo" as VoteCategory, label: "데모데이 투표" },
];

export default function Home() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [totalVotes] = useState(0);

  // Zustand에서 로그인 상태와 사용자 정보 가져오기
  const { isAuthenticated, user, initializeAuth, logout } = useAuthStore();

  // 페이지 로드 시 localStorage에서 사용자 정보 복원
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      setShowMenu(false);
      router.push("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
      // 실패해도 로컬 상태는 정리
      logout();
      setShowMenu(false);
    }
  };

  const handleVoteClick = () => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    } else {
      console.log("투표 페이지로 이동");
    }
  };

  const handleVoteClick2 = () => {
    if (!isAuthenticated) {
      router.push("/vote");
    } else {
      console.log("투표 페이지로 이동");
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="relative px-6 py-4 flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {isAuthenticated && user && (
            <span>{user.username}님 환영합니다</span>
          )}
        </div>
        <button onClick={() => setShowMenu(!showMenu)} className="text-2xl">
          ☰
        </button>

        {showMenu && (
          <div className="absolute top-16 right-6 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-6 py-3 hover:bg-gray-50 text-base"
              >
                로그아웃
              </button>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="block px-6 py-3 hover:bg-gray-50 text-base"
                  onClick={() => setShowMenu(false)}
                >
                  로그인
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-6 py-3 hover:bg-gray-50 text-base border-t border-gray-200"
                  onClick={() => setShowMenu(false)}
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        )}
      </header>

      <div className="flex-1 px-6 pt-12 flex flex-col">
        <div className="mb-16">
          <h1 className="text-[28px] font-bold mb-2">
            🏆 <span className="text-[#7C3AED]">2025</span> CEOS
          </h1>
          <h2 className="text-[28px] font-bold">22ND AWARDS</h2>
        </div>

        <div className="mb-16">
          <div className="space-y-3">
            {voteCategories.map((category) => (
              <div
                key={category.id}
                className="text-lg font-medium text-gray-800"
              >
                # {category.label}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-auto pb-8 text-center">
          <button
            onClick={handleVoteClick}
            className="w-full max-w-[200px] mx-auto block px-8 py-3 bg-white border-2 border-[#7C3AED] text-[#7C3AED] rounded-full text-base font-medium hover:bg-[#7C3AED] hover:text-white transition-colors"
          >
            투표하러 가기
          </button>
          <p className="mt-4 text-sm text-[#7C3AED]">
            현재 총 <span className="font-bold">{totalVotes}건</span>의 투표가
            진행되었어요!
          </p>

          <button
            onClick={handleVoteClick2}
            className="w-full max-w-[200px] mx-auto block px-8 py-3 bg-white border-2 border-[#7C3AED] text-[#7C3AED] rounded-full text-base font-medium hover:bg-[#7C3AED] hover:text-white transition-colors"
          >
            투표하러 가기(프론트)
          </button>
        </div>
      </div>
    </div>
  );
}
