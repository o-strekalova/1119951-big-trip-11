import moment from "moment";

export const TRANSPORTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
export const ACTIVITIES = [`check-in`, `sightseeing`, `restaurant`];

export const formatTime = (date) => {
  return moment(date).format(`HH:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD[T]HH:mm`);
};

export const formatMonth = (date) => {
  return moment(date).format(`MMM DD`);
};

export const formatDays = (date) => {
  if (date >= 86400000) {
    const diff = moment.utc(date).subtract(86400000);
    return diff.format(`DD[D] HH[H] mm[M]`);
  } else {
    return moment.utc(date).format(`HH[H] mm[M]`);
  }
};

export const getPreposition = (type) => {
  let preposition = `in`;
  if (TRANSPORTS.indexOf(type) > 0) {
    preposition = `to`;
  }
  return preposition;
};
