// 후보자 타입 정의
export interface Candidate {
  id: string;
  name: string;
  part: 'FRONTEND' | 'BACKEND';
  team: string;
  image: string; // URL
  introduction: string;
}


export const frontendCandidates: Candidate[] = [
  // DIGGINDIE
  {
    id: 'fe1-member-1',
    name: '백승선',
    part: 'FRONTEND',
    team: 'DIGGINDIE',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'fe1-member-2',
    name: '조성아',
    part: 'FRONTEND',
    team: 'DIGGINDIE',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // MODELLY
  {
    id: 'fe2-member-1',
    name: '손주완',
    part: 'FRONTEND',
    team: 'MODELLY',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'fe2-member-2',
    name: '정윤지',
    part: 'FRONTEND',
    team: 'MODELLY',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // CATCHUP
  {
    id: 'fe3-member-1',
    name: '정성훈',
    part: 'FRONTEND',
    team: 'CATCHUP',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'fe3-member-2',
    name: '장자윤',
    part: 'FRONTEND',
    team: 'CATCHUP',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // MENUAL
  {
    id: 'fe4-member-1',
    name: '신용섭',
    part: 'FRONTEND',
    team: 'MENUAL',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'fe4-member-2',
    name: '최무헌',
    part: 'FRONTEND',
    team: 'MENUAL',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // STORIX
  {
    id: 'fe5-member-1',
    name: '김윤성',
    part: 'FRONTEND',
    team: 'STORIX',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'fe5-member-2',
    name: '이채연',
    part: 'FRONTEND',
    team: 'STORIX',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
];

export const backendCandidates: Candidate[] = [
  // DIGGINDIE
  {
    id: 'be1-member-1',
    name: '변호영',
    part: 'BACKEND',
    team: 'DIGGINDIE',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'be1-member-2',
    name: '이윤지',
    part: 'BACKEND',
    team: 'DIGGINDIE',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // MODELLY
  {
    id: 'be2-member-1',
    name: '이연호',
    part: 'BACKEND',
    team: 'MODELLY',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'be2-member-2',
    name: '이준영',
    part: 'BACKEND',
    team: 'MODELLY',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // CATCHUP
  {
    id: 'be3-member-1',
    name: '배승식',
    part: 'BACKEND',
    team: 'CATCHUP',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'be3-member-2',
    name: '신혁',
    part: 'BACKEND',
    team: 'CATCHUP',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // MENUAL
  {
    id: 'be4-member-1',
    name: '이지원',
    part: 'BACKEND',
    team: 'MENUAL',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'be4-member-2',
    name: '변하영',
    part: 'BACKEND',
    team: 'MENUAL',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  // STORIX
  {
    id: 'be5-member-1',
    name: '서가영',
    part: 'BACKEND',
    team: 'STORIX',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
  {
    id: 'be5-member-2',
    name: '이수아',
    part: 'BACKEND',
    team: 'STORIX',
    image: '/images/candidates/profile.svg',
    introduction: '여기에 후보자 소개를 작성하세요.',
  },
];

export const allCandidates: Candidate[] = [
  ...frontendCandidates,
  ...backendCandidates,
];

export function getCandidatesByPart(part: 'FRONTEND' | 'BACKEND'): Candidate[] {
  return part === 'FRONTEND' ? frontendCandidates : backendCandidates;
}

export function getCandidateById(id: string): Candidate | undefined {
  return allCandidates.find((candidate) => candidate.id === id);
}
