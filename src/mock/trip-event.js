const EVENT_TYPES = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`, `check-in`, `sightseeing`, `restaurant`];
const DESTINATIONS = [`Paris`, `Rome`, `London`, `Moscow`, `Minsk`];
const OFFER_TITLES = [`Order Uber`, `Add luggage`, `Switch to comfort`, `Rent a car`, `Add breakfast`, `Book tickets`, `Lunch in city`];
const DESCRIPTIONS = [
  `Lorem ipsum dolor sit amet, consectetur adipiscing elit`,
  `Cras aliquet varius magna, non porta ligula feugiat eget`,
  `Fusce tristique felis at fermentum pharetra`,
  `Aliquam id orci ut lectus varius viverra`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui`,
  `Sed sed nisi sed augue convallis suscipit in sed felis`,
  `Aliquam erat volutpat`,
  `Nunc fermentum tortor ac porta dapibus`,
  `In rutrum ac purus sit amet tempus`,
];
const EVENTS_COUNT = 20;

const getRandomIntegerNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomIntegerNumber(0, array.length);
  return array[randomIndex];
};

const generateOffer = () => {
  return {
    offerTitle: getRandomArrayItem(OFFER_TITLES),
    offerPrice: getRandomIntegerNumber(1, 50) * 10,
  };
};

const generateNewArray = (count, item) => {
  return new Array(count)
    .fill(item);
};

const generateDescription = () => {
  return generateNewArray(getRandomIntegerNumber(1, 5), getRandomArrayItem(DESCRIPTIONS))
    .join(`. `);
};

const getRandomDate = () => {
  const newDate = new Date();
  newDate.setFullYear(getRandomIntegerNumber(2020, 2020));
  newDate.setMonth(getRandomIntegerNumber(1, 2));
  newDate.setDate(getRandomIntegerNumber(2, 7));
  newDate.setHours(getRandomIntegerNumber(0, 24));
  newDate.setMinutes(getRandomIntegerNumber(0, 59));

  return newDate;
};

const generateOffers = () => {
  return generateNewArray(getRandomIntegerNumber(0, 5), ``)
    .map(generateOffer);
};

const generateTripEvent = () => {
  let start = getRandomDate();
  let finish = new Date(start);
  finish.setHours(finish.getHours() + getRandomIntegerNumber(0, 30));

  return {
    type: getRandomArrayItem(EVENT_TYPES),
    destination: getRandomArrayItem(DESTINATIONS),
    offers: generateOffers(),
    description: generateDescription(),
    pictures: generateNewArray(getRandomIntegerNumber(1, 5), `http://picsum.photos/248/152?r=${Math.random()}`),
    start,
    finish,
    price: getRandomIntegerNumber(1, 50) * 10,
    isFavorite: Math.random() > 0.5,
  };
};

const tripEvents = generateNewArray(EVENTS_COUNT, ``).map(generateTripEvent).sort((a, b) => a.start - b.start);

export {tripEvents};
