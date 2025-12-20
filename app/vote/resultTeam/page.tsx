"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import { partsData } from "@/lib/data/teams";

type VoteResultItem = {
  teamId?: string;
  candidateId?: string;
  votes: number;
};

export default function TeamVoteResult() {
  const router = useRouter();

  const [voteMap, setVoteMap] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  // mockData라서 구성이 이상할 수 있음
  const frontendTeams = useMemo(() => {
    return partsData.find((p) => p.id === "frontend")?.teams ?? [];
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setIsLoading(true);

        const res = await axios.get<{ results: VoteResultItem[] }>(
          "/api/v1/votes/results",
          { params: { part: "FRONTEND" } }
        );

        const next: Record<string, number> = {};
        for (const item of res.data.results ?? []) {
          const id = item.teamId ?? item.candidateId;
          if (!id) continue;
          next[id] = item.votes;
        }
        setVoteMap(next);
      } catch (e) {
        console.error(e);
        alert("결과를 불러오지 못했어요");
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, []);

  const sortedTeams = useMemo(() => {
    const list = frontendTeams.map((t) => ({
      ...t,
      votes: voteMap[t.id] ?? 0,
    }));

    return list.sort((a, b) => {
      if (b.votes !== a.votes) return b.votes - a.votes;
      return a.name.localeCompare(b.name, "en");
    });
  }, [frontendTeams, voteMap]);

  return (
    <>
      <header className="flex items-center px-6 py-4 bg-white">
        <button onClick={() => router.back()} className="mr-3">
          <Image
            src="/images/login/back.svg"
            alt="back"
            width={10}
            height={18}
          />
        </button>
        <h1 className="text-xl font-semibold">투표 결과</h1>
      </header>

      <div className="w-full max-w-md mx-auto px-4">
        <FieldGroup>
          <FieldSet>
            <FieldLabel className="items-center text-center text-xl font-bold my-7">
              데모데이 투표 결과
            </FieldLabel>

            <div className="space-y-5">
              {sortedTeams.map((t) => (
                <div key={t.id} className="py-1">
                  <FieldLabel className="block">
                    <Field
                      orientation="horizontal"
                      // className="border border-gray-200 rounded-xl bg-white"
                    >
                      <FieldContent className="items-center">
                        <div className="w-full flex items-center justify-between">
                          <FieldTitle>{t.name.toUpperCase()}</FieldTitle>
                          <span className="text-sm font-semibold text-gray-700">
                            {isLoading ? "-" : `${t.votes}표`}
                          </span>
                        </div>
                      </FieldContent>
                    </Field>
                  </FieldLabel>
                </div>
              ))}
            </div>
          </FieldSet>
        </FieldGroup>

        <div className="w-full flex justify-center pt-10 pb-10">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="h-11 px-10 rounded-full bg-black text-white font-semibold text-sm hover:bg-gray-800 transition-colors"
          >
            돌아가기
          </button>
        </div>
      </div>
    </>
  );
}
