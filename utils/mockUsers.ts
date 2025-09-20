import { ProfileUser } from '../types/ProfileUser';

const MOCK_USERS: ProfileUser[] = [
  {
    id: '1',
    name: 'Juana',
    lastName: 'Costa',
    email: 'recruiter@mail.com',
    role: 'recruiter',
    avatarUrl: 'https://i.pravatar.cc/400?img=43',
    ocupation: 'Diseañdora UX/UI',
    city: 'Argentina',
    bio: 'Perfil de Juana (mock)',
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
    id: '2',
    name: 'Pedro',
    lastName: 'Gonzalez',
    email: 'dev@mail.com',
    role: 'candidate',
    avatarUrl: 'https://i.pravatar.cc/400?img=12',
    ocupation: 'Desarrollador Frontend',
    city: 'Uruguay',
    bio: 'Perfil de Pedro (mock)',
    skills: ['React', 'React Native'],
    offers: [],
  },
];

export const fetchUserByIdMock = async (
  id?: string,
): Promise<ProfileUser | undefined> => {
  if (!id) return undefined;
  // Simular retardo de request, quitar luego
  await new Promise((r) => setTimeout(r, 100));
  return MOCK_USERS.find((user) => user.id === id);
};

export const fetchUserByEmailMock = async (
  email?: string,
): Promise<ProfileUser | undefined> => {
  if (!email) return undefined;
  await new Promise((r) => setTimeout(r, 100));
  return MOCK_USERS.find((user) => user.email === email);
};
