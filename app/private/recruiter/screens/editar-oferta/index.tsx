import React, { useEffect, useState } from 'react';
import CrearOferta from '../crear-oferta';
import { getOferta } from '@services/OfertaService';
import { OfertaValues } from '@models/OfertaValues';

const EditarOferta = ({ navigation, route }: any) => {
  const [data, setData] = useState<OfertaValues | null>(null);

  const initOferta = async () => {
    const { ofertaId } = route.params ?? {};
    if (ofertaId) {
      const oferta = await getOferta(ofertaId);
      setData(oferta);
    }
  };

  useEffect(() => {
    initOferta();
  }, []);

  return (
    <CrearOferta
      navigation={navigation}
      editing={true}
      data={data}
    ></CrearOferta>
  );
};

export default EditarOferta;
