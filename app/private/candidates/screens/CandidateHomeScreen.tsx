import { View, Text } from 'react-native';
import React from 'react';
import SwipeMatch from '../../shared/swipe_match/SwipeMatch';

import { candidates2 } from '../../../../mockup/candidates';
import CandidateCard from '../../../../components/ui/CandidateCard';
import { JobOffer } from '../../../../interfaces/JobOffer';
import JobOfferCard from '../../../../components/ui/JobOfferCard';

const ofertasDeTrabajo: JobOffer[] = [
  {
    recruiterFirstName: 'Lucía',
    recruiterLastName: 'Gómez',
    title: 'Desarrollador Frontend',
    company: 'TechNova',
    location: 'Buenos Aires, Argentina',
    jobType: 'REMOTO',
    jobTime: 'FULL TIME',
    about:
      'Buscamos un desarrollador frontend con experiencia en React para trabajar en proyectos innovadores.',
  },
  {
    recruiterFirstName: 'Carlos',
    recruiterLastName: 'Pérez',
    title: 'Analista de Datos',
    company: 'DataVision',
    location: 'Madrid, España',
    jobType: 'HIBRIDO',
    jobTime: 'PART TIME',
    about:
      'El rol implica análisis de grandes volúmenes de datos y generación de reportes para clientes internacionales.',
  },
  {
    recruiterFirstName: 'María',
    recruiterLastName: 'Fernández',
    title: 'Diseñador UX/UI',
    company: 'Creativa Studio',
    location: 'Ciudad de México, México',
    jobType: 'REMOTO',
    jobTime: 'FULL TIME',
    about:
      'Estamos en búsqueda de un diseñador UX/UI para mejorar la experiencia de usuario en nuestras plataformas digitales.',
  },
  {
    recruiterFirstName: 'Javier',
    recruiterLastName: 'Rodríguez',
    title: 'Ingeniero DevOps',
    company: 'CloudWorks',
    location: 'Barcelona, España',
    jobType: 'HIBRIDO',
    jobTime: 'FULL TIME',
    about:
      'Responsable de la automatización de procesos y mantenimiento de infraestructura en la nube.',
  },
  {
    recruiterFirstName: 'Sofía',
    recruiterLastName: 'Martínez',
    title: 'Especialista en Marketing Digital',
    company: 'MarketPro',
    location: 'Lima, Perú',
    jobType: 'REMOTO',
    jobTime: 'PART TIME',
    about:
      'Se requiere experiencia en campañas de Google Ads y manejo de redes sociales para clientes del sector retail.',
  },
];
const CandidateHomeScreen = () => {
  return (
    <SwipeMatch<JobOffer>
      data={ofertasDeTrabajo}
      renderItem={(
        item: JobOffer,
        key: string | number | undefined,
        handleScrollEnabled?: (val: boolean) => void,
      ) => {
        return (
          <JobOfferCard
            key={key}
            {...{ item, handleScrollEnabled }}
          ></JobOfferCard>
        );
      }}
    ></SwipeMatch>
  );
};

export default CandidateHomeScreen;
