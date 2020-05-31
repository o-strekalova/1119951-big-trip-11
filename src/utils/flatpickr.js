export const createStartFlatpickr = (point, onChange) => {
  return {
    enableTime: true,
    time_24hr: true,
    dateFormat: `d/m/Y H:i`,
    defaultDate: point.start || `today`,
    onChange,
  };
};

export const createEndFlatpickr = (point, onChange) => {
  return {
    enableTime: true,
    time_24hr: true,
    dateFormat: `d/m/Y H:i`,
    defaultDate: point.end || `today`,
    onChange,
  };
};
