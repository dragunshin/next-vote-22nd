export type Part = 'frontend' | 'backend';

export interface TeamMember {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  members: TeamMember[];
}

export interface PartData {
  id: Part;
  label: string;
  teams: Team[];
}

export const partsData: PartData[] = [
  {
    id: 'frontend',
    label: 'Front-End',
    teams: [
      {
        id: 'fe-team-1',
        name: 'DiggIndie',
        members: [
          { id: 'fe1-member-1', name: '백승선' },
          { id: 'fe1-member-2', name: '조성아' },
        ],
      },
      {
        id: 'fe-team-2',
        name: '모델리',
        members: [
          { id: 'fe2-member-1', name: '손주완' },
          { id: 'fe2-member-2', name: '정윤지' },
        ],
      },
      {
        id: 'fe-team-3',
        name: '캐치업',
        members: [
          { id: 'fe3-member-1', name: '정성훈' },
          { id: 'fe3-member-2', name: '장자윤' },
        ],
      },
      {
        id: 'fe-team-4',
        name: 'menual',
        members: [
          { id: 'fe4-member-1', name: '신용섭' },
          { id: 'fe4-member-2', name: '최무헌' },
        ],
      },
      {
        id: 'fe-team-5',
        name: 'STORIX',
        members: [
          { id: 'fe5-member-1', name: '김윤성' },
          { id: 'fe5-member-2', name: '이채연' },
        ],
      },
    ],
  },
  {
    id: 'backend',
    label: 'Back-End',
    teams: [
      {
        id: 'be-team-1',
        name: 'Digglndie',
        members: [
          { id: 'be1-member-1', name: '변호영' },
          { id: 'be1-member-2', name: '이윤지' },
        ],
      },
      {
        id: 'be-team-2',
        name: '모델리',
        members: [
          { id: 'be2-member-1', name: '이연호' },
          { id: 'be2-member-2', name: '이준영' },
        ],
      },
      {
        id: 'be-team-3',
        name: '캐치업',
        members: [
          { id: 'be3-member-1', name: '배승식' },
          { id: 'be3-member-2', name: '신혁' },
        ],
      },
      {
        id: 'be-team-4',
        name: 'menual',
        members: [
          { id: 'be4-member-1', name: '이지원' },
          { id: 'be4-member-2', name: '변하영' },
        ],
      },
      {
        id: 'be-team-5',
        name: 'STORIX',
        members: [
          { id: 'be5-member-1', name: '서가영' },
          { id: 'be5-member-2', name: '이수아' },
        ],
      },
    ],
  },
];
