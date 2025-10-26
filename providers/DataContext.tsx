import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabase/supabaseClient';
import { DBModalidad } from '@database/DBModalidad';
import { DBTipoJornada } from '@database/DBTipoJornada';
import { DBContratacion } from '@database/DBContratacion';
import axios from 'axios';

interface DataContextType {
  modalidad: DBModalidad[];
  tipoJornada: DBTipoJornada[];
  contratacion: DBContratacion[];
  loading: boolean;
}

export const DataContext = createContext<DataContextType>({
  modalidad: [],
  tipoJornada: [],
  contratacion: [],
  loading: true,
});

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [modalidad, setModalidad] = useState<DBModalidad[]>([]);
  const [tipoJornada, setJornada] = useState<DBTipoJornada[]>([]);
  const [contratacion, setContratacion] = useState<DBContratacion[]>([]);
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

      modalidadData && setModalidad(modalidadData);
      jornadaData && setJornada(jornadaData);
      contratacionData && setContratacion(contratacionData);

      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <DataContext.Provider
      value={{ modalidad, tipoJornada, contratacion, loading }}
    >
      {children}
    </DataContext.Provider>
  );
};
