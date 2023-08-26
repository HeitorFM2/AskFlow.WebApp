import format from "date-fns/format"

export function formatDate(originDate) {
  const parsedDate = new Date(originDate);
  return format(parsedDate, 'HH:mm dd/MM/yyyy');
}
