
export const generateTimeOptions = () => {
  const times = [];
  for (let hour = 8; hour < 20; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      times.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  return times;
};

export const durationOptions = [
  { label: '15 minuti', value: '15' },
  { label: '30 minuti', value: '30' },
  { label: '45 minuti', value: '45' },
  { label: '1 ora', value: '60' },
  { label: '1.5 ore', value: '90' },
  { label: '2 ore', value: '120' }
];
