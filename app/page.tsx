import Link from 'next/link';

export default function Home() {
  return (
    <div className="">
      <Link href="/auth/login">
        <button className="px-6 py-3 bg-black text-white">
          로그인 페이지
        </button>
      </Link>
      <Link href="/auth/signup">
        <button className="px-6 py-3 bg-gray-800 text-white">
          회원가입 페이지
        </button>
      </Link>
      <Link href="/auth/social-signup">
        <button className="px-6 py-3 bg-gray-600 text-white">
          소셜 회원가입 페이지
        </button>
      </Link>
      <Link href="/auth/interest-selection">
        <button className="px-6 py-3 bg-gray-400 text-white">
          관심 분야 선택 페이지
        </button>
      </Link>
      <Link href="/auth/terms-agreement">
        <button className="px-6 py-3 bg-gray-300 text-white">
          약관 동의 페이지
        </button>
      </Link>
    </div>
  );
}
