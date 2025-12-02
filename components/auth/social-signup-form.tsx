'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { authService } from '@/services/auth.service';
import type { ApiErrorResponse } from '@/lib/api/types';
import { AxiosError } from 'axios';
import { z } from 'zod';

// Zod 스키마 정의
const socialSignupSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요.'),
  birthDate: z.string()
    .min(1, '생년월일을 입력해주세요.')
    .regex(/^\d{8}$/, '생년월일은 8자리 숫자로 입력해주세요. (예: 19980101)'),
  email: z.string()
    .min(1, '이메일을 입력해주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
});

// 에러 메시지 매핑 (소셜 회원가입은 별도 에러코드가 없어 공통 에러만 처리)
const ERROR_MESSAGES: Record<number, string> = {
  1005: '이메일 형식이 올바르지 않습니다.',
  1006: '이미 가입된 이메일입니다.',
  1007: '필수 약관 및 개인정보 처리에 동의해야 합니다.',
};

type UserType = 'customer' | 'expert';

export function SocialSignUpForm() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('customer');
  const [formData, setFormData] = useState({
    nickname: '',
    birthDate: '',
    email: '',
  });
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // 입력 시 해당 필드의 에러 메시지 초기화
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
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
    setErrors({});

    // 약관 동의 확인
    if (!agreed) {
      setErrors({ general: '필수 약관 및 개인정보 처리에 동의해야 합니다.' });
      return;
    }

    // Zod 클라이언트 검증
    const validationResult = socialSignupSchema.safeParse(formData);

    if (!validationResult.success) {
      // 각 필드별 에러를 객체로 변환
      const fieldErrors: Record<string, string> = {};
      validationResult.error.issues.forEach((issue) => {
        const fieldName = issue.path[0] as string;
        if (!fieldErrors[fieldName]) {
          fieldErrors[fieldName] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.socialSignup({
        nickname: formData.nickname,
        birth: formatBirthDate(formData.birthDate),
        email: formData.email,
        userType: userType === 'customer' ? 'GROOMER' : 'EXPERT',
        agreeTerms: agreed,
        agreePrivacy: agreed,
      });

      // 소셜 회원가입 성공
      if (response.statusCode === 0) {
        console.log('소셜 회원가입 성공:', response.data);
        // 관심 분야 선택 페이지로 이동
        router.push('/auth/interest-selection');
      }
    } catch (err) {
      // 에러 처리
      const axiosError = err as AxiosError<ApiErrorResponse>;
      if (axiosError.response) {
        const { statusCode } = axiosError.response.data;

        // statusCode를 기반으로 에러 메시지 매핑
        const errorMessage = ERROR_MESSAGES[statusCode] || '회원가입에 실패했습니다. 다시 시도해주세요.';
        setErrors({ general: errorMessage });
      } else {
        setErrors({ general: '네트워크 오류가 발생했습니다. 다시 시도해주세요.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    formData.nickname &&
    formData.birthDate &&
    formData.email &&
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
          onClick={() => setUserType('customer')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'customer' ? 'text-black' : 'text-gray-400'
          }`}
        >
          그루머
          {userType === 'customer' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
        <button
          onClick={() => setUserType('expert')}
          className={`flex-1 py-4 text-base font-medium transition-all relative ${
            userType === 'expert' ? 'text-black' : 'text-gray-400'
          }`}
        >
          전문가
          {userType === 'expert' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-black" />
          )}
        </button>
      </div>

      {/* Form - 스크롤 가능 영역 */}
      <div className="flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="px-6 pt-7 flex flex-col gap-6">
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

          {/* 생년월일 */}
          <div>
            <label className="block text-base font-medium text-black mb-3">생년월일</label>
            <input
              name="birthDate"
              placeholder="ex) 19980101"
              value={formData.birthDate}
              onChange={handleChange}
              className={`w-full h-12 px-5 border rounded focus:outline-none placeholder:text-gray-400 text-[12px] bg-white ${
                errors.birthDate ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-gray-300'
              }`}
            />
            {errors.birthDate && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.birthDate}</p>
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
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 px-1">{errors.email}</p>
            )}
          </div>

          {/* General Error Message */}
          {errors.general && (
            <div className="text-red-500 text-sm px-3 py-2 bg-red-50 rounded border border-red-200">
              {errors.general}
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
      <div>
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
