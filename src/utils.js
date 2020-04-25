const TRANSPORT = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
export const MONTHS = {
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

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTER: `after`,
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
    case RenderPosition.AFTER:
      container.after(element);
      break;
  }
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
    month: checkNumber(date.getMonth()),
    day: checkNumber(date.getDate()),
    hours: checkNumber(date.getHours()),
    minutes: checkNumber(date.getMinutes()),
  };
};
