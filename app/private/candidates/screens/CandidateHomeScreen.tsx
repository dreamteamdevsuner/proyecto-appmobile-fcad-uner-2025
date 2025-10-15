import { View, Text } from 'react-native';
import React from 'react';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';

import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import { JobOffer } from '../../../../interfaces/JobOffer';
import JobOfferCard from '../../../../components/ui/JobOfferCard';

const ofertasDeTrabajo: JobOffer[] = [
  {
    recruiterFirstName: 'Renata',
    recruiterLastName: 'Scheneider',
    recruiterPhoto: 'renata',
    recruiterLocation: 'Córdoba, Argentina',
    recruiterProfession: 'Talent Acquisition - Freelancer',
    title: 'Diseñador UX/UI',
    company: 'Banco Santander',
    location: 'Buenos Aires, Argentina',
    jobType: 'REMOTO',
    jobTime: 'FULL TIME',
    about:
      'Estamos en búsqueda de un diseñador UX/UI especializado en microinteracciones.',
    skills: ['Figma', 'Microinteracciones', 'Miro'],
    cuentaRegresiva: 'Quedan 3 días para aplicar',
  },
  {
    recruiterFirstName: 'Mayra',
    recruiterLastName: 'Roa',
    recruiterPhoto: 'mayra',
    recruiterLocation: 'Buenos Aires, Argentina',
    recruiterProfession: 'HR Specialist - Mercado Libre',
    title: 'Diseñador UX/UI Sr.',
    company: 'Mercado Libre',
    location: 'Buenos Aires, Argentina',
    jobType: 'HIBRIDO',
    jobTime: 'FULL TIME',
    about:
      'Buscamos un Diseñador UX/UI Sr. con experiencia en diseño de interfaces para plataformas de e-commerce.',
    skills: ['Figma', 'Sketch', 'Prototipado'],
    cuentaRegresiva: 'Quedan 5 días para aplicar',
  },
  {
    recruiterFirstName: 'Lucía',
    recruiterLastName: 'Vasconccellos',
    recruiterPhoto: 'lucia',
    recruiterProfession: 'HR Specialist - Talent Agency Looper',
    recruiterLocation: 'Buenos Aires, Argentina',
    title: 'Diseñador UI',
    company: 'Proyecto freelance',
    location: 'Mendoza, Argentina',
    jobType: 'REMOTO',
    jobTime: 'FULL TIME',
    about:
      'Estamos en búsqueda de un diseñador UX/UI para un proyecto freelance de 3 meses.',
    skills: ['Adobe XD', 'Figma', 'Prototipado'],
    cuentaRegresiva: 'Quedan 2 días para aplicar',
  },
  {
    recruiterFirstName: 'Tom',
    recruiterLastName: 'Bordt',
    recruiterPhoto: 'tom',
    recruiterProfession: 'HR Manager - Roblander',
    recruiterLocation: 'Miami, EEUU',
    title: 'Visual Designer',
    company: 'Roblander',
    location: 'Miami, EEUU',
    jobType: 'REMOTO',
    jobTime: 'PART TIME',
    about:
      'Se busca Visual Designer con experiencia en branding y diseño gráfico para proyectos digitales.',
    skills: ['Photoshop', 'Illustrator', 'Branding'],
    cuentaRegresiva: 'Quedan 7 días para aplicar',
  },
  {
    recruiterFirstName: 'Ann Lynn',
    recruiterLastName: 'Parker',
    recruiterPhoto: 'ann',
    recruiterProfession: 'HR Manager - Tech Solutions',
    recruiterLocation: 'Austin, EEUU',
    title: 'UI Designer',
    company: 'Lovelace Agency',
    location: 'San Francisco, EEUU',
    jobType: 'REMOTO',
    jobTime: 'FULL TIME',
    about:
      'Buscamos un UI Designer con experiencia en diseño de interfaces para aplicaciones móviles.',
    skills: ['Figma', 'Sketch', 'Prototipado'],
    cuentaRegresiva: 'Quedan 4 días para aplicar',
  },
];
const CandidateHomeScreen = () => {
  return (
    <SwipeMatch<JobOffer>
      data={ofertasDeTrabajo}
      renderItem={({ item }) => {
        return <JobOfferCard {...{ item }}></JobOfferCard>;
      }}
    ></SwipeMatch>
  );
};

export default CandidateHomeScreen;
