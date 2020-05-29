export const createStartFlatpickr = (tripEvent, onChange) => {
  return {
    enableTime: true,
    time_24hr: true,
    dateFormat: `d/m/Y H:i`,
    defaultDate: tripEvent.start || `today`,
    onChange,
  };
};

export const createFinishFlatpickr = (tripEvent, onChange) => {
  return {
    enableTime: true,
    time_24hr: true,
    dateFormat: `d/m/Y H:i`,
    defaultDate: tripEvent.finish || `today`,
    onChange,
  };
};
