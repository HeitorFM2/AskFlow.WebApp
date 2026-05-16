import format from 'date-fns/format'

export function formatPostDate(originDate) {
  const parsed = new Date(originDate)
  const now = new Date()
  const isToday =
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate()
  if (isToday) return format(parsed, 'HH:mm')
  if (parsed.getFullYear() === now.getFullYear()) return format(parsed, 'dd/MM')
  return format(parsed, 'dd/MM/yy')
}
