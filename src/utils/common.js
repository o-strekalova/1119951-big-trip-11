import moment from "moment";

const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];

export const formatTime = (date) => {
  return moment(date).format(`hh:mm`);
};

export const formatDate = (date) => {
  return moment(date).format(`YYYY-MM-DD`);
};

export const formatMonth = (date) => {
  return moment(date).format(`MMM DD`);
};

export const formatDays = (date) => {
  if (date > 86400000) {
    return moment(date).format(`DD[D] hh[H] mm[M]`);
  } else {
    return moment(date).format(`hh[H] mm[M]`);
  }
};

export const getPreposition = (type) => {
  let preposition = `in`;
  if (TRANSPORT.indexOf(type) > 0) {
    preposition = `to`;
  }
  return preposition;
};
