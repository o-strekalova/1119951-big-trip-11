const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const MONTHS = {
  '01': `JAN`,
  '02': `FEB`,
  '03': `MAR`,
  '04': `APR`,
  '05': `MAY`,
  '06': `JUN`,
  '07': `JUL`,
  '08': `AUG`,
  '09': `SEP`,
  '10': `OCT`,
  '11': `NOV`,
  '12': `DEC`,
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
