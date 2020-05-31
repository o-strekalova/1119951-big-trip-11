// es

export const createStartFlatpickr = (point, onChange) => {
  return {
    enableTime: true,
    time_24hr: true, // eslint-disable-line
    dateFormat: `d/m/Y H:i`,
    defaultDate: point.start || `today`,
    onChange,
  };
};

export const createEndFlatpickr = (point, onChange) => {
  return {
    enableTime: true,
    time_24hr: true, // eslint-disable-line
    dateFormat: `d/m/Y H:i`,
    defaultDate: point.end || `today`,
    onChange,
  };
};
