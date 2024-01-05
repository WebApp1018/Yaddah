export const minutesToHours = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (hours === 0) return `${mins} minutes`;
  if (mins === 0) return `${hours} hour${hours > 1 ? "s" : ""}`;
  return `${hours}hours ${mins}minutes`;
};

export const getRandomArrayIndex = (array) => {
  return Math.floor(Math.random() * array.length);
};
