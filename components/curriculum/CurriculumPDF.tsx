import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Directory, Paths } from 'expo-file-system';

import { PerfilView } from '@models/PerfilView';

export const generarPDF = async (profileUser: PerfilView) => {
  try {
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              margin: 0;
              background-color: #fff;
              color: #222;
              line-height: 1.5;
            }

            h1, h2, h3 {
              margin: 0;
              padding: 0;
            }

            .watermark {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-image: url('https://okqiscrckxxqfyiabngh.supabase.co/storage/v1/object/public/assets/logo-jobsy-bln.png'); /* URL DE TU IMAGEN */
              background-repeat: no-repeat;
              background-position: center;
              background-size: 60%; /* Ajusta tamaño */
              opacity: 0.10; /* Transparencia */
              z-index: -1;
            }


            /* HEADER */
            .header {
              display: flex;
              gap: 25px;
              align-items: center;
              margin-bottom: 40px;
            }

            .photo {
              width: 140px;
              height: 140px;
              border-radius: 20px;
              object-fit: cover;
              border: 3px solid #eee;
            }
            .header-info{
              margin-left: 30px;
            }
            .name {
              font-size: 30px;
              font-weight: bold;
              letter-spacing: -0.5px;
            }

            .email {
              font-size: 14px;
              color: #666;
            }

            .address {
              font-size: 14px;
              color: #666;
            }

            /* SECTIONS */
            .section {
              margin-top: 35px;
            }

            .section-title {
              font-size: 20px;
              font-weight: bold;
              border-bottom: 2px solid #111;
              padding-bottom: 4px;
              margin-bottom: 12px;
            }

            /* ITEMS */
            .item {
              margin-bottom: 16px;
            }

            .item-title {
              font-weight: bold;
              font-size: 15px;
            }

            /* CHIPS */
            .chips {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              margin-top: 10px;
              margin-right:20px;
            }

            .chip {
              background: #A06FA6;
               color: #fff; 
              border-radius: 50px;
              padding: 6px 14px;
              font-size: 13px;
              font-weight: bold;
              border: 1px solid #222;
              margin: 4px;
            }

            /* LINKS */
            ul {
              padding-left: 18px;
            }

            .link-item {
              margin-bottom: 5px;
            }
          </style>
        </head>

        <body>
          <div class="watermark"></div>
          <!-- HEADER -->
          <div class="header">
            ${profileUser.fotoPerfil ? `<img class="photo" src="${profileUser.fotoPerfil}" />` : ''}
            <div class="header-info">
              <div class="name">${profileUser.nombre} ${profileUser.apellido}</div>
              <div class="email">${profileUser.email}</div>

              <div class="address">
                ${profileUser.direccion?.ciudad ? profileUser.direccion?.ciudad + ',' : ''} 
                
              </div>
            </div>
          </div>

          <!-- PERFIL PROFESIONAL -->
          <div class="section">
            <div class="section-title">Perfil Profesional</div>

            ${profileUser.bio ? `<p>${profileUser.bio}</p>` : ''}
          </div>

          <!-- EDUCACIÓN -->
          <div class="section">
            <div class="section-title">Educación</div>
            ${
              profileUser.estudios &&
              profileUser.estudios
                .map(
                  (est) => `
                <div class="item">
                  <div class="item-title">${est.titulo}</div>
                  <div>${est.nombreinstitucion || ''}</div>
                  <div>${est.fechainicio || ''} – ${est.fechafin || 'Actual'}</div>
                </div>
              `,
                )
                .join('')
            }
          </div>

          <!-- EXPERIENCIA LABORAL -->
          <div class="section">
            <div class="section-title">Experiencia Laboral</div>
            ${
              profileUser.experiencia &&
              profileUser.experiencia
                .map(
                  (job) => `
                <div class="item">
                  <div class="item-title">${job.posicion}</div>
                  <div>${job.nombreempresa || job.empresa || ''}</div>
                  <div>${job.fechainicio || ''} – ${job.fechafin || 'Actual'}</div>
                </div>
              `,
                )
                .join('')
            }
          </div>

    <!-- SKILLS – CHIPS -->
          <div class="section">
            <div class="section-title">Habilidades</div>
            <div class="chips">
        ${
          profileUser.skills?.habilidades &&
          profileUser.skills?.habilidades
            .map(
              (s) => `
          <div class="chip">${s.nombre}</div>
        `,
            )
            .join('')
        }
            </div>
      
          </div>

          <!-- ENLACES -->
          <div class="section">
            <div class="section-title">Enlaces</div>
            <ul>
              ${
                profileUser.enlaces &&
                profileUser.enlaces
                  .map(
                    (e) => `
                <li class="link-item"><strong>${e.tipoenlace.nombre}:</strong> ${e.url}</li>
              `,
                  )
                  .join('')
              }
            </ul>
          </div>

        </body>
      </html>

    `;

    const { uri: tempUri } = await Print.printToFileAsync({ html });

    const pdfDir = new Directory(Paths.document, 'pdfs');
    pdfDir.create({ idempotent: true, intermediates: true });

    const fileName = `mi_archivo_${Date.now()}.pdf`;
    const destFile = new File(pdfDir, fileName);
    const tempFile = new File(tempUri);
    await tempFile.move(destFile);

    await Sharing.shareAsync(destFile.uri);
  } catch (error) {
    console.error('Error generando PDF:', error);
  }
};
