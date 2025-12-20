"use client";

import { useMemo, useState } from "react";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

import { partsData } from "@/lib/data/teams";

export default function FieldChoiceCard() {
  const router = useRouter();

  const frontendTeams = useMemo(() => {
    return partsData.find((p) => p.id === "frontend")?.teams ?? [];
  }, []);

  const [selectedId, setSelectedId] = useState(
    () => frontendTeams[0]?.id ?? ""
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onVote = async () => {
    if (!selectedId || isSubmitting) return;

    try {
      setIsSubmitting(true);

      await axios.post("/api/v1/votes", {
        part: "FRONTEND",
        candidateId: selectedId,
      });
    } catch (e) {
      console.error(e);
      alert("투표에 실패했어요 잠시 후 다시 시도해주세요");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-xl font-semibold">투표하기</h1>
      </header>

      <div className="w-full max-w-md md:max-w-3xl mx-auto px-4">
        <FieldGroup>
          <FieldSet>
            <FieldLabel className="items-center text-center text-xl font-bold my-7">
              데모데이 투표
            </FieldLabel>

            <RadioGroup
              value={selectedId}
              onValueChange={setSelectedId}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {frontendTeams.map((team) => (
                <FieldLabel
                  key={team.id}
                  htmlFor={team.id}
                  className="block py-3"
                >
                  <Field orientation="horizontal">
                    <FieldContent className="items-center text-center">
                      <FieldTitle>{team.name.toUpperCase()}</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value={team.id} id={team.id} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </FieldGroup>

        <div className="mx-auto w-full max-w-md md:max-w-xl px-4 pt-30 pb-6">
          <button
            type="button"
            // onClick={onVote}
            onClick={() => router.push("/vote/resultTeam")}
            disabled={!selectedId || isSubmitting}
            className="
        w-full h-14
        flex items-center justify-center
        font-semibold text-base bg-black text-white
        hover:bg-gray-800 transition-colors rounded
        disabled:opacity-50 disabled:cursor-not-allowed
      "
          >
            {isSubmitting ? "투표 중..." : "투표하기"}
          </button>
        </div>
      </div>
    </>
  );
}
