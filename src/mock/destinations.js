import {DESTINATIONS, DESCRIPTIONS, getRandomArrayItem, getRandomIntegerNumber, generateNewArray} from "./utils.js";

const generateDescription = () => {
  return getRandomArrayItem(DESCRIPTIONS);
};

const generateDestinations = () => {
  const destinations = [];

  DESTINATIONS.map((name) => {
    const destination = {};
    destination.description = `${name} ${generateNewArray(getRandomIntegerNumber(1, 5), generateDescription).join(`. `)}`;
    destination.name = name;
    destination.pictures = [];
    for (let i = 0; i < 5; i++) {
      const newPicture = {};
      newPicture.src = `http://picsum.photos/248/152?r=${Math.random()}`;
      newPicture.description = `${DESCRIPTIONS[i]}`;
      destination.pictures.push(newPicture);
    }
    destinations.push(destination);
  });

  return destinations;
};

export const destinations = generateDestinations();
