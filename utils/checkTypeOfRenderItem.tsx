import { boolean } from "yup"
import ProfileUser from '../types/ProfileUser';
import { ImageSourcePropType } from "react-native";

/* export interface LinkImage {
  link: (id: string) => any
} */
export interface LinkImage {
  link: any
}
export interface PortfolioText {
  portfolioText: string
}

export const checkIsLinkImage = (item: Record<string, any>): item is LinkImage => {
  return (item?.link)
}

export const checkIsPortfolioText = (item: Record<string, any>): item is PortfolioText => {
  return item?.portfolioText
}
/* {
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
  }, */
export const isUser = (item: Record<string, any>): item is ProfileUser => {
  return item?.id
}