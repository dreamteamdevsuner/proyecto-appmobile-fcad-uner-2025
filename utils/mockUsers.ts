import { ProfileUser } from '../types/ProfileUser';

const MOCK_USERS: ProfileUser[] = [
  {
    id: 111,
    name: 'Juan',
    lastName: 'Costa',
    email: 'recruiter@mail.com',
    role: 'recruiter',
    avatarUrl: 'https://i.pravatar.cc/400?img=12',
    ocupation: 'Diseañdor UX/UI',
    city: 'Argentina',
    bio: 'Perfil de Juan (mock)',
    skills: ['UX', 'Figma'],
    offers: [
      {
        name: 'UX Santander',
        status: 'Activa',
        description: 'Lorem Ipsum Dolor',
      },
      {
        name: 'Frontend Naranja',
        status: 'Activa',
        description: 'Lorem Ipsum Dolor',
      },
      {
        name: 'DevOps',
        status: 'Pausada',
        description: 'Lorem Ipsum Dolor',
      },
    ],
  },
  {
    id: 222,
    name: 'Juana',
    lastName: 'Costa',
    email: 'dev@mail.com',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/400?img=43',
    ocupation: 'Diseñadora UX/UI',
    city: 'Argentina',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    skills: ['Figma', 'Illustrator', 'Whimsical', 'Miro', 'Hotjar'],
    offers: [],
    studies: ['2010 - 2040 | Ingeniería en Informática - UNER'],
    otherStudies: ['Curso de Desarrollador Fullstack de SoyDalto'],
    experience: ['Atención al público'],
    socialLinks: [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
      },
      {
        name: 'Pinterest',
        url: 'https://pinterest.com',
      },
    ],
  },
  {
    id: 100,
    name: 'Ana Lopez Gonzales',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'candidate',
  },
  {
    id: 2,
    name: 'Juan Rio Bravo',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'candidate',
  },
  { id: 3, name: 'Juana Costa', role: 'candidate' }, // sin avatar
  {
    id: 4,
    name: 'Martín Peréz',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'candidate',
  },
  {
    id: 5,
    name: 'Camilo Cuevas',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    role: 'candidate',
    ocupation: 'Diseñadora UX/UI',
    city: 'Argentina',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. \n\nDuis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    skills: ['Corel', 'Illustrator', 'Whimsical', 'Miro', 'Hotjar'],
    offers: [],
    studies: ['2010 - 2040 | Ingeniería en Informática - UNER'],
    otherStudies: ['Curso de Desarrollador Fullstack de SoyDalto'],
    experience: ['Atención al público'],
    socialLinks: [
      {
        name: 'LinkedIn',
        url: 'https://linkedin.com',
      },
      {
        name: 'GitHub',
        url: 'https://github.com',
      },
      {
        name: 'Pinterest',
        url: 'https://pinterest.com',
      },
    ],
  },
  {
    id: 6,
    name: 'Sofia Reyes',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    role: 'candidate',
  },
  {
    id: 7,
    name: 'Rosa Ramos',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 8, name: 'John Doe', role: 'candidate' },
  {
    id: 9,
    name: 'Jude Smith',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
  },
  {
    id: 10,
    name: 'Leonor Lewis',
    role: 'recruiter',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
  },
  { id: 11, name: 'Luis García', role: 'candidate' },
  { id: 12, name: 'Elba Gomez', role: 'candidate' },
];

export const fetchUserByIdMock = async (
  id?: number,
): Promise<ProfileUser | undefined> => {
  if (!id) return undefined;
  // Simular retardo de request, quitar luego
  // await new Promise((r) => setTimeout(r, 100));
  return MOCK_USERS.find((user) => user.id === id);
};

export const fetchUserByEmailMock = async (
  email?: string,
): Promise<ProfileUser | undefined> => {
  if (!email) return undefined;
  // await new Promise((r) => setTimeout(r, 100));
  return MOCK_USERS.find((user) => user.email === email);
};
