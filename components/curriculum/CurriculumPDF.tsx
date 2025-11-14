import React from 'react';
import { Button } from 'react-native-paper';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { PerfilView } from '@models/PerfilView';

type CVProps = {
  profileUser: PerfilView;
};

export default function CurriculumPDF({ profileUser }: CVProps) {
  const generarPDF = async () => {
    const html = `
      <html>
        <body style="font-family: Arial; padding: 20px;">
          <h1>${profileUser.nombre} ${profileUser.apellido}</h1>
          
          ${
            profileUser.fotoPerfil
              ? `<img src="${profileUser.fotoPerfil}" style="width:120px;height:120px;border-radius:60px;" />`
              : ''
          }

          <h2>Datos personales</h2>
          <p><b>Email:</b> ${profileUser.email}</p>
          <p><b>Dirección:</b> ${profileUser.direccion?.ciudad}</p>


          <h2>Educación</h2>
          ${
            profileUser.estudios &&
            profileUser.estudios
              .map(
                (ed) => `
            <div>
              <h3>${ed.titulo}</h3>
              <p>${ed.nombreinstitucion} (${ed.fechainicio})</p>
            </div>
          `,
              )
              .join('')
          }
        </body>
      </html>
    `;

    const { uri } = await Print.printToFileAsync({ html });

    await Sharing.shareAsync(uri);
  };

  return (
    <Button mode="contained" onPress={generarPDF}>
      Descargar CV PDF
    </Button>
  );
}
