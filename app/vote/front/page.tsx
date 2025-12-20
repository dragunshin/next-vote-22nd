// "use client";
// import { useRouter } from "next/navigation";
// import Image from "next/image";

// import {
//   Field,
//   FieldContent,
//   FieldDescription,
//   FieldGroup,
//   FieldLabel,
//   FieldSet,
//   FieldTitle,
// } from "@/components/ui/field";
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

// export default function FieldChoiceCard() {
//   const router = useRouter();
//   return (
//     <>
//       {" "}
//       <header className="flex items-center px-6 py-4">
//         <button onClick={() => router.back()} className="mr-3">
//           <Image
//             src="/images/login/back.svg"
//             alt="back"
//             width={10}
//             height={18}
//           />
//         </button>
//         <h1 className="text-xl font-semibold">투표하기</h1>
//       </header>
//       <div className="w-full max-w-md mx-auto px-4">
//         <FieldGroup>
//           <FieldSet>
//             <FieldLabel className="items-center text-center text-xl font-bold my-7">
//               프론트 파트장 투표
//             </FieldLabel>

//             <RadioGroup defaultValue="dr">
//               <FieldLabel htmlFor="dr">
//                 <Field orientation="horizontal">
//                   <FieldContent className="items-center text-center">
//                     <FieldTitle>신용섭</FieldTitle>
//                   </FieldContent>
//                   <RadioGroupItem value="dr" id="dr" />
//                 </Field>
//               </FieldLabel>
//               <FieldLabel htmlFor="mh1">
//                 <Field orientation="horizontal">
//                   <FieldContent className="items-center text-center">
//                     <FieldTitle>최무헌</FieldTitle>
//                   </FieldContent>
//                   <RadioGroupItem value="mh1" id="mh1" />
//                 </Field>
//               </FieldLabel>
//               <FieldLabel htmlFor="mh">
//                 <Field orientation="horizontal">
//                   <FieldContent className="items-center text-center">
//                     <FieldTitle>Menual</FieldTitle>
//                     <FieldDescription>남성 그루밍 플랫폼</FieldDescription>
//                   </FieldContent>
//                   <RadioGroupItem value="mh" id="mh" />
//                 </Field>
//               </FieldLabel>
//             </RadioGroup>
//           </FieldSet>
//         </FieldGroup>

//         <button
//           type="submit"
//           className="fixed left-1/2 -translate-x-1/2 bottom-20
//              h-14 w-[350px]
//              flex items-center justify-center
//              font-semibold text-base bg-black text-white
//              hover:bg-gray-800 transition-colors rounded
//              disabled:opacity-50 disabled:cursor-not-allowed"
//         >
//           투표하기
//         </button>
//       </div>
//     </>
//   );
// }

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

import { frontendCandidates } from "@/lib/data/candidates";

export default function FieldChoiceCard() {
  const router = useRouter();

  const defaultId = useMemo(() => frontendCandidates[0]?.id ?? "", []);
  const [selectedId, setSelectedId] = useState(defaultId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onVote = async () => {
    if (!selectedId || isSubmitting) return;

    try {
      setIsSubmitting(true);

      // 추후 수정
      await axios.post("/api/v1/votes", {
        part: "FRONTEND",
        candidateId: selectedId,
      });
      //router.push('/vote/resultFront')
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
              프론트 파트장 투표
            </FieldLabel>

            <RadioGroup
              value={selectedId}
              onValueChange={setSelectedId}
              className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6"
            >
              {frontendCandidates.map((c) => (
                <FieldLabel key={c.id} htmlFor={c.id} className="block py-3">
                  <Field orientation="horizontal">
                    <FieldContent className="items-center text-center">
                      <FieldTitle>{c.name}</FieldTitle>
                    </FieldContent>
                    <RadioGroupItem value={c.id} id={c.id} />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </FieldGroup>

        <div className="mx-auto w-full max-w-md md:max-w-xl px-4 pt-30 pb-6">
          <button
            type="button"
            //onClick={onVote}
            onClick={() => router.push("/vote/resultFront")}
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
