import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="">
      <button
        onClick={() => navigate('/auth/login')}
        className="px-6 py-3 bg-black text-white"
      >
        로그인 페이지
      </button>
      <button
        onClick={() => navigate('/auth/signup')}
        className="px-6 py-3 bg-gray-800 text-white"
      >
        회원가입 페이지
      </button>
      <button
        onClick={() => navigate('/auth/social-signup')}
        className="px-6 py-3 bg-gray-600 text-white"
      >
        소셜 회원가입 페이지
      </button>
    </div>
  );
};

export default HomePage;
