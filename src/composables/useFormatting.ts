import dayjs from 'dayjs';

export function useFormatting() {
  function formatDate(date: string | Date, format = 'YYYY-MM-DD HH:mm') {
    return dayjs(date).format(format);
  }

  return {
    formatDate,
  };
}
