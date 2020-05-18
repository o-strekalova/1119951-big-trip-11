import {EVENT_TYPES, getRandomIntegerNumber} from "./utils.js";

const generateOffersForType = () => {
  const offers = [];

  EVENT_TYPES.map((type) => {
    const offerType = {};
    offerType.type = type;
    offerType.offers = [];
    for (let i = 0; i < 3; i++) {
      const newOffer = {};
      newOffer.title = `${type}-offer-${[i + 1]}`;
      newOffer.price = getRandomIntegerNumber(1, 50) * 10;
      offerType.offers.push(newOffer);
    }
    offers.push(offerType);
  });

  return offers;
};

export const offersForTypes = generateOffersForType();
