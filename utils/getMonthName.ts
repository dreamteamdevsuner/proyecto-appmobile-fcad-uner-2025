const monthNames = [
  'Ene.',
  'Feb.',
  'Mar.',
  'Abr.',
  'May.',
  'Jun.',
  'Jul.',
  'Ago.',
  'Sep.',
  'Oct.',
  'Nov.',
  'Dic.',
];

/**
 * Obtiene el nombre del mes en español dado su índice.
 * @param monthIndex número del mes (0-11)
 * @returns abreviatura del nombre del mes en español o cadena vacía si es inválido
 */
export function getMonthName(monthIndex: number): string {
  if (monthIndex < 0 || monthIndex > 11) {
    return '';
  }
  return monthNames[monthIndex];
}
