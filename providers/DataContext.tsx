import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { DBModalidad } from '@database/DBModalidad';
import { DBTipoJornada } from '@database/DBTipoJornada';
import { DBContratacion } from '@database/DBContratacion';
import { DBSkill } from '@database/DBSkill';

interface DataContextType {
  modalidad: DBModalidad[];
  tipoJornada: DBTipoJornada[];
  contratacion: DBContratacion[];
  softSkills: DBSkill[];
  hardSkills: DBSkill[];
  loading: boolean;
}

export const DataContext = createContext<DataContextType>({
  modalidad: [],
  tipoJornada: [],
  contratacion: [],
  softSkills: [],
  hardSkills: [],
  loading: true,
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [modalidad, setModalidad] = useState<DBModalidad[]>([]);
  const [tipoJornada, setJornada] = useState<DBTipoJornada[]>([]);
  const [contratacion, setContratacion] = useState<DBContratacion[]>([]);
  const [softSkills, setSoftSkills] = useState<DBSkill[]>([]);
  const [hardSkills, setHardSkills] = useState<DBSkill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: modalidadData } = await supabase
        .from('modalidad')
        .select('*');
      const { data: jornadaData } = await supabase
        .from('tipojornada')
        .select('*');
      const { data: contratacionData } = await supabase
        .from('contratacion')
        .select('*');
      const { data: skillData } = await supabase.from('skill').select('*');

      modalidadData && setModalidad(modalidadData);
      jornadaData && setJornada(jornadaData);
      contratacionData && setContratacion(contratacionData);
      if (skillData) {
        setSoftSkills(skillData.filter((x) => x.idtiposkill === 1));
        setHardSkills(skillData.filter((x) => x.idtiposkill === 2));
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{
        modalidad,
        tipoJornada,
        contratacion,
        softSkills,
        hardSkills,
        loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
