import {DESTINATIONS, EVENT_TYPES, getRandomIntegerNumber, getRandomArrayItem, generateNewArray} from "./utils.js";

const OFFER_TITLES = [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`];
const EVENTS_COUNT = 20;
let id = 1;

const generateOffer = () => {
  return {
    title: getRandomArrayItem(OFFER_TITLES),
    price: getRandomIntegerNumber(1, 50) * 10,
  };
};

const getRandomDate = () => {
  const newDate = new Date();
  newDate.setFullYear(getRandomIntegerNumber(2020, 2020));
  newDate.setMonth(getRandomIntegerNumber(0, 1));
  newDate.setDate(getRandomIntegerNumber(2, 7));
  newDate.setHours(getRandomIntegerNumber(0, 24));
  newDate.setMinutes(getRandomIntegerNumber(0, 59));

  return newDate;
};

const generateTripEvent = () => {
  const start = getRandomDate();
  const finish = new Date(start);
  finish.setHours(finish.getHours() + getRandomIntegerNumber(0, 30));

  return {
    price: getRandomIntegerNumber(1, 50) * 10,
    start,
    finish,
    destination: getRandomArrayItem(DESTINATIONS),
    id: id++,
    isFavorite: Math.random() > 0.5,
    offers: generateNewArray(getRandomIntegerNumber(0, 5), generateOffer),
    type: getRandomArrayItem(EVENT_TYPES),
  };
};

const tripEvents = generateNewArray(EVENTS_COUNT, generateTripEvent);

export {tripEvents};
