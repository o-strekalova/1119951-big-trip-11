const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
export const MONTHS = {
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

export const getPreposition = (type) => {
  let preposition = `in`;
  if (TRANSPORT.indexOf(type) > 0) {
    preposition = `to`;
  }
  return preposition;
};

export const checkNumber = (number) => {
  number = number < 10 ? `0${number}` : `${number}`;
  return number;
};

export const deconstructDate = (date) => {
  return {
    year: date.getFullYear(),
    month: checkNumber(date.getMonth() + 1),
    day: checkNumber(date.getDate()),
    hours: checkNumber(date.getHours()),
    minutes: checkNumber(date.getMinutes()),
  };
};
