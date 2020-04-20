import {getPreposition, checkNumber} from "./../utils.js";

export const createTripEventTemplate = (tripEvent) => {
  const MINUTE = 60000;
  const HOUR = 3600000;
  const DAY = 86400000;

  let {type, destination, offers, start, finish, price} = tripEvent;

  let duration = finish - start;

  let days = ``;
  let hours = ``;
  let minutes = ``;

  if (duration < HOUR) {
    minutes = `${checkNumber(Math.round(duration / MINUTE))}M`;
  } else if (duration < DAY) {
    hours = `${checkNumber(Math.round(duration / HOUR))}H`;
    minutes = `${checkNumber(Math.round(duration % HOUR / MINUTE))}M`;
  } else {
    days = `${checkNumber(Math.round(duration / DAY))}D`;
    hours = `${checkNumber(Math.round(duration % DAY / HOUR))}H`;
    minutes = `${checkNumber(Math.round(duration % HOUR / MINUTE))}M`;
  }

  duration = `${days} ${hours} ${minutes}`;

  start = start.toLocaleTimeString([], {hour: `2-digit`, minute: `2-digit`});
  finish = finish.toLocaleTimeString([], {hour: `2-digit`, minute: `2-digit`});

  const offersList = document.createElement(`ul`);

  for (let i = 0; i < offers.length; i++) {
    let currentOffer = offers[i];
    let {offerTitle, offerPrice} = currentOffer;
    offersList.insertAdjacentHTML(`beforeend`, `<li class="event__offer">
                                    <span class="event__offer-title">${offerTitle}</span>
                                    &plus;
                                    &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
                                  </li>`);
  }

  return (`<li class="trip-events__item">
              <div class="event">
                <div class="event__type">
                  <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="Event type icon">
                </div>
                <h3 class="event__title">${type.charAt(0).toUpperCase() + type.slice(1)} ${getPreposition(type)} ${destination}</h3>

                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${start}">${start}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${finish}">${finish}</time>
                  </p>
                  <p class="event__duration">${duration}</p>
                </div>

                <p class="event__price">
                  &euro;&nbsp;<span class="event__price-value">${price}</span>
                </p>

                <h4 class="visually-hidden">Offers:</h4>
                <ul class="event__selected-offers">
                  ${offersList.innerHTML}
                </ul>

                <button class="event__rollup-btn" type="button">
                  <span class="visually-hidden">Open event</span>
                </button>
              </div>
            </li>`
  );
};
