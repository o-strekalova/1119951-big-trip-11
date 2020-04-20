const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const MONTHS = {
  '00': `JAN`,
  '01': `FEB`,
  '02': `MAR`,
  '03': `APR`,
  '04': `MAY`,
  '05': `JUN`,
  '06': `JUL`,
  '07': `AUG`,
  '08': `SEP`,
  '09': `OCT`,
  '10': `NOV`,
  '11': `DEC`,
};

const getPreposition = (type) => {
  let preposition = `in`;
  if (TRANSPORT.indexOf(type) > 0) {
    preposition = `to`;
  }
  return preposition;
};

const checkNumber = (number) => {
  number = number < 10 ? `0${number}` : `${number}`;
  return number;
};

const deconstructDate = (date) => {
  return {
    year: date.getFullYear(),
    month: checkNumber(date.getMonth()),
    day: checkNumber(date.getDate()),
    hours: checkNumber(date.getHours()),
    minutes: checkNumber(date.getMinutes()),
  };
};

export {MONTHS, getPreposition, checkNumber, deconstructDate};