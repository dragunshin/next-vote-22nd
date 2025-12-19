'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { authService } from '@/services/auth.service';
import { getErrorMessage } from '@/lib/api/error-handler';
import { partsData, type Part } from '@/lib/data/teams';
import { z } from 'zod';

// Zod 스키마 정의 (회원가입용 - 프로젝트 특화)
const signupSchema = z.object({
  nickname: z.string()
    .min(1, '닉네임을 입력해주세요.')
    .min(2, '닉네임은 최소 2자 이상이어야 합니다.')
    .max(8, '닉네임은 최대 8자까지 가능합니다.'),
  email: z.string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string()
    .min(1, '비밀번호를 입력해주세요.')
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다.')
    .max(14, '비밀번호는 최대 14자까지 가능합니다.')
    .regex(/^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d]+$/, '비밀번호는 영문과 숫자 조합이어야 합니다.'),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

export function SignUpForm() {
  const router = useRouter();
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [formData, setFormData] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const selectedPartData = partsData.find((p) => p.id === selectedPart);
  const selectedTeam = selectedPartData?.teams.find((t) => t.id === selectedTeamId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    // 일반 에러도 초기화
    if (errors.general) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.general;
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // 팀/멤버 선택 확인
    if (!selectedPart || !selectedTeamId || !selectedMemberId) {
      setErrors({ general: '파트, 팀, 이름을 모두 선택해주세요.' });
      return;
    }

    setIsLoading(true);

    try {
      // 1차 검증: Zod 스키마로 클라이언트 측 검증
      const validatedData = signupSchema.parse(formData);

      // 선택한 팀 정보 가져오기
      const selectedTeamData = selectedPartData?.teams.find((t) => t.id === selectedTeamId);

      // 검증 통과 후 API 호출 - 백엔드 요구 형식에 맞춤
      const requestData = {
        username: validatedData.nickname,
        email: validatedData.email,
        password: validatedData.password,
        passwordConfirm: validatedData.passwordConfirm,
        team: selectedTeamData?.name || '',
        part: selectedPart === 'frontend' ? 'FRONTEND' : 'BACKEND',
      };

      console.log('회원가입 요청 데이터:', requestData);
      const response = await authService.signup(requestData);

      // 회원가입 성공
      if (response.statusCode === 0) {
        console.log('회원가입 성공:', response.data);
        // 홈화면으로 이동
        router.push('/');
      }
    } catch (err) {
      // Zod 검증 에러 처리
      if (err && typeof err === 'object' && 'issues' in err) {
        const zodError = err as { issues: Array<{ path: string[]; message: string }> };
        const fieldErrors: Record<string, string> = {};

        zodError.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          if (!fieldErrors[fieldName]) {
            fieldErrors[fieldName] = issue.message;
          }
        });

        setErrors(fieldErrors);
      } else {
        // API 에러 처리: 백엔드에서 전송한 에러 메시지
        const errorMessage = getErrorMessage(err);
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.nickname &&
    formData.email &&
    formData.password &&
    formData.passwordConfirm &&
    selectedPart &&
    selectedTeamId &&
    selectedMemberId;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => router.back()} className="mr-3">
          <Image src="/images/login/back.svg" alt="back" width={10} height={18} />
        </button>
        <h1 className="text-xl font-semibold">회원가입</h1>
      </header>

      {/* Tabs */}
      <div className="flex">
        <button
          onClick={() => {
            setSelectedPart('frontend');
            setSelectedTeamId('');
            setSelectedMemberId('');
          }}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            selectedPart === 'frontend' ? 'text-black' : 'text-gray-400'
          }`}
        >
          Front-End
          {selectedPart === 'frontend' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => {
            setSelectedPart('backend');
            setSelectedTeamId('');
            setSelectedMemberId('');
          }}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            selectedPart === 'backend' ? 'text-black' : 'text-gray-400'
          }`}
        >
          Back-End
          {selectedPart === 'backend' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Form - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-6 pt-7 flex flex-col gap-6">
          {/* 팀명 선택 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">팀명 *</label>
            <div className="relative">
              <select
                value={selectedTeamId}
                onChange={(e) => {
                  setSelectedTeamId(e.target.value);
                  setSelectedMemberId('');
                }}
                disabled={!selectedPart}
                className="w-full h-12 px-4 border border-gray-200 rounded appearance-none text-[12px] disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">팀을 선택해주세요</option>
                {selectedPartData?.teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 이름 선택 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">이름 *</label>
            <div className="relative">
              <select
                value={selectedMemberId}
                onChange={(e) => setSelectedMemberId(e.target.value)}
                disabled={!selectedTeamId}
                className="w-full h-12 px-4 border border-gray-200 rounded appearance-none text-[12px] disabled:bg-gray-50 disabled:text-gray-400"
              >
                <option value="">이름을 선택해주세요</option>
                {selectedTeam?.members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                  <path d="M1 1.5L6 6.5L11 1.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* 닉네임 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">닉네임</label>
            <input
              name="nickname"
              placeholder="이름을 입력해주세요."
              value={formData.nickname}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[12px] bg-white ${
                errors.nickname ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
            />
            {errors.nickname && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.nickname}</p>
            )}
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">이메일</label>
            <input
              name="email"
              type="text"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[12px] bg-white ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="8-14자 영문+숫자 조합 입력해주세요."
              value={formData.password}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[12px] bg-white ${
                errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.password}</p>
            )}
          </div>

          {/* 비밀번호 재확인 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">비밀번호 재확인</label>
            <input
              name="passwordConfirm"
              type="password"
              placeholder="비밀번호를 한 번 더 입력해주세요."
              value={formData.passwordConfirm}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[12px] bg-white ${
                errors.passwordConfirm ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
              disabled={isLoading}
            />
            {errors.passwordConfirm && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.passwordConfirm}</p>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="text-red-500 text-sm px-3 py-2 bg-red-50 rounded border border-red-200">
              {errors.general}
            </div>
          )}


          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !isFormValid}
            className="w-full h-14 font-medium transition-colors bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed mb-6"
          >
            {isLoading ? '처리 중...' : '다음'}
          </button>
        </form>
      </div>
    </div>
  );
}
