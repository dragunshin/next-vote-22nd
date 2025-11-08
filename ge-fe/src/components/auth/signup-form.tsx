import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backIcon from '../../images/login/back.svg';

type UserType = 'customer' | 'expert';

export function SignUpForm() {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<UserType>('customer');
  const [formData, setFormData] = useState({
    nickname: '',
    birthDate: '',
    email: '',
    password: '',
    passwordConfirm: '',
  });
  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('회원가입:', { ...formData, userType, agreed });
  };

  const isFormValid =
    formData.nickname &&
    formData.birthDate &&
    formData.email &&
    formData.password &&
    formData.passwordConfirm &&
    agreed;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <button onClick={() => navigate(-1)} className="mr-3">
          <img src={backIcon} alt="back" className="w-2.5 h-[18px]" />
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
              className="w-full h-14 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-sm bg-white"
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
              className="w-full h-14 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-sm bg-white"
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
              className="w-full h-14 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-sm bg-white"
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
              className="w-full h-14 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-sm bg-white"
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
              className="w-full h-14 px-5 border border-gray-200 rounded focus:outline-none focus:border-gray-300 placeholder:text-gray-400 text-sm bg-white"
            />
          </div>

          {/* 약관 동의 */}
          <div className="pt-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300"
              />
              <span className="text-sm text-gray-600">
                이용약관 및 개인정보처리 방침에 동의합니다. (필수)
              </span>
            </label>
          </div>
        </form>
      </div>

      {/* Submit Button - 하단 고정 */}
      <div className="mt-auto">
        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full h-14 font-medium transition-colors ${
            isFormValid ? 'bg-black text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          다음
        </button>
      </div>
    </div>
  );
}
