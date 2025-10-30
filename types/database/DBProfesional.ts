export interface DBProfesional {
  id: string;
  idusuario: string;
  idmodalidad?: number | null;
  idtipojornada?: number | null;
  movilidad: boolean;     //De momento estas 2 últimas no figuran en el formulario
  alerta: boolean;
}