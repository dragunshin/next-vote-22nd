'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import type { ApiErrorResponse } from '@/lib/api/types';
import { AxiosError } from 'axios';
import { partsData, type Part } from '@/lib/data/teams';
import { z } from 'zod';

// Zod 스키마 정의
const signupSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
  birthDate: z.string()
    .regex(/^\d{8}$/, '생년월일은 8자리 숫자로 입력해주세요. (예: 19980101)'),
  email: z.string().email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string()
    .min(8, '비밀번호는 8자리 이상이어야 합니다.')
    .regex(/^(?=.*[A-Za-z])(?=.*\d)/, '비밀번호는 영문과 숫자를 포함해야 합니다.'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

// 에러 메시지 매핑
const ERROR_MESSAGES: Record<number, string> = {
  1001: '닉네임 형식이 올바르지 않습니다.',
  1002: '이미 사용 중인 닉네임입니다.',
  1003: '비밀번호 형식이 올바르지 않습니다.',
  1004: '생년월일 형식이 올바르지 않습니다.',
  1005: '이메일 형식이 올바르지 않습니다.',
  1006: '이미 가입된 이메일입니다.',
  1007: '필수 약관 및 개인정보 처리에 동의해야 합니다.',
  1008: '비밀번호가 일치하지 않습니다.',
};

type UserType = 'customer' | 'expert';

export function SignUpForm() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('customer');
  const [selectedPart, setSelectedPart] = useState<Part | null>(null);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [selectedMemberId, setSelectedMemberId] = useState<string>('');
  const [formData, setFormData] = useState({
    nickname: '',
    birthDate: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const selectedPartData = partsData.find((p) => p.id === selectedPart);
  const selectedTeam = selectedPartData?.teams.find((t) => t.id === selectedTeamId);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 에러 메시지 초기화
    if (error) setError('');
  };

  const formatBirthDate = (date: string): string => {
    // YYYYMMDD -> YYYY-MM-DD 변환
    if (date.length === 8) {
      return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)}`;
    }
    return date;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 약관 동의 확인
    if (!agreed) {
      setError('필수 약관 및 개인정보 처리에 동의해야 합니다.');
      return;
    }

    // 팀/멤버 선택 확인
    if (!selectedPart || !selectedTeamId || !selectedMemberId) {
      setError('파트, 팀, 이름을 모두 선택해주세요.');
      return;
    }

    // Zod 클라이언트 검증
    const validationResult = signupSchema.safeParse(formData);
    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      setError(firstError.message);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.signup({
        nickname: formData.nickname,
        birth: formatBirthDate(formData.birthDate),
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        userType: userType === 'customer' ? 'GROOMER' : 'EXPERT',
        agreeTerms: agreed,
        agreePrivacy: agreed,
      });

      // 회원가입 성공
      if (response.statusCode === 0) {
        console.log('회원가입 성공:', response.data);
        // 관심 분야 선택 페이지로 이동
        router.push('/auth/interest-selection');
      }
    } catch (err) {
      // 에러 처리
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { statusCode } = axiosError.response.data;

        // statusCode를 기반으로 에러 메시지 매핑
        setError(ERROR_MESSAGES[statusCode] || '회원가입에 실패했습니다. 다시 시도해주세요.');
      } else {
        setError('네트워크 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.nickname &&
    formData.birthDate &&
    formData.email &&
    formData.password &&
    formData.passwordConfirm &&
    selectedPart &&
    selectedTeamId &&
    selectedMemberId &&
    agreed;

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
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">생년월일</label>
            <input
              name="birthDate"
              placeholder="ex) 19980101"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">이메일</label>
            <input
              name="email"
              type="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
          </div>

          {/* 비밀번호 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">비밀번호</label>
            <input
              name="password"
              type="password"
              placeholder="영문+숫자 조합 8자리 이상 입력해주세요."
              value={formData.password}
              onChange={handleChange}
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
            />
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
              className="w-full h-12 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-[12px] bg-white"
              disabled={isLoading}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm px-1">
              {error}
            </div>
          )}
        </form>
      </div>

      {/* 약관 동의 - 하단 고정 */}
      <div className="px-6 py-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="w-5 h-5 rounded border-gray-300"
          />
          <span className="text-[12px] text-gray-600">
            <Link
              href="/auth/terms-of-service"
              className="underline text-black hover:font-bold"
            >
              이용약관
            </Link>
            {' '}및{' '}
            <Link
              href="/auth/privacy-policy"
              className="underline text-black hover:font-bold"
            >
              개인정보 취급방침
            </Link>
            에 동의합니다. (필수)
          </span>
        </label>
      </div>
      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full h-14 font-medium transition-colors bg-black text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '처리 중...' : '다음'}
        </button>
      </div>
    </div>
  );
}
