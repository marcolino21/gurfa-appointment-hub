
export const getDurationLabel = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return hours === 1 ? `1 ora` : `${hours} ore`;
  } else {
    return hours === 1 ? `1 ora ${mins} min` : `${hours} ore ${mins} min`;
  }
};
