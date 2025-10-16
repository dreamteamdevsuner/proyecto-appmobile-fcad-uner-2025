export const Role = {
  candidate: 'candidate',
  recruiter: 'recruiter',
};

export const userEditarPerfil = [
  {
    id: 111,
    nombre: 'Juan',
    apellido: 'Schneider',
    profesion: 'Talent acquisition', 
    institucion: 'Freelance',
    localizacion: 'Argentina', 
    palabrasClave: ['empleabilidad'], 
    role: Role.recruiter,
  },
  {
    id: 222,
    nombre: "Juana",
    apellido: "Costa",
    profesion: "Diseñador UX/UI",
    localizacion: "Argentina",
    herramientas: ["figma", "sketch"],
    habilidades: ["ui", "prototipado"],
    aboutMe: "Diseñador con 5 años de experiencia...",
    estudiosFormales: "Licenciatura en Diseño",
    otrosEstudios: "Certificación UI/UX",
    idiomas: ["espanol_nativo", "ingles_c2"],
    modalidad: "remoto",
    jornada: "jornada_completa",
    contrato: "permanente",
    email: "juanac@ejemplo.com",
    redes: [
      { tipo: "LinkedIn", url: "https://linkedin.com/j.costa" },
      { tipo: "Behance", url: "https://behance.net/juana" }
    ],
    role: Role.candidate,
  }
];

export const getRecruiterData = () => {
  const userData = userEditarPerfil.find(user => user.id === 111);
  if (!userData) return null;

  return {
    nombre: userData.nombre,
    apellido: userData.apellido,
    profesion: userData.profesion,
    institucion: userData.institucion,
    localizacion: userData.localizacion,
    palabrasClave: userData.palabrasClave,
  };
};

export const getCandidateData = () => {
  const userData = userEditarPerfil.find(user => user.id === 222);
  if (!userData) return null;

  return {
    nombre: userData.nombre,
    apellido: userData.apellido,
    profesion: userData.profesion,
    localizacion: userData.localizacion.toLowerCase(),
    herramientas: userData.herramientas,
    habilidades: userData.habilidades,
    aboutMe: userData.aboutMe,
    estudiosFormales: userData.estudiosFormales,
    otrosEstudios: userData.otrosEstudios,
    idiomasSeleccionados: userData.idiomas,
    modalidadSeleccionada: userData.modalidad,
    jornadaSeleccionada: userData.jornada,
    contratoSeleccionado: userData.contrato,
    email: userData.email,
    redes: userData.redes,
  };
};