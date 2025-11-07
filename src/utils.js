export const formatTwoDigits = (number) => String(number).padStart(2, "0");

export const getCurrentDateTimeString = () => {
  const now = new Date();
  const day = formatTwoDigits(now.getDate());
  const month = formatTwoDigits(now.getMonth() + 1);
  const year = String(now.getFullYear()).slice(-2);
  const hours = formatTwoDigits(now.getHours());
  const minutes = formatTwoDigits(now.getMinutes());
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};


