import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/home/page';
import LoginPage from '../pages/auth/login/page';
import SignUpPage from '../pages/auth/signup/page';
import SocialSignUpPage from '../pages/auth/social-signup/page';
import { TermsOfServicePage } from '../pages/auth/terms-of-service/page';
import { PrivacyPolicyPage } from '../pages/auth/privacy-policy/page';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/signup',
    element: <SignUpPage />,
  },
  {
    path: '/auth/social-signup',
    element: <SocialSignUpPage />,
  },
  {
    path: '/auth/terms-of-service',
    element: <TermsOfServicePage />,
  },
  {
    path: '/auth/privacy-policy',
    element: <PrivacyPolicyPage />,
  },
]);
