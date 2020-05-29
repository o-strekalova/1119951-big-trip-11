import {getPreposition, formatTime, formatDays, formatDate} from "./../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createTripEventTemplate = (tripEvent) => {

  let {type, destination, offers, start, finish, price} = tripEvent;
  let duration = formatDays(finish - start);

  const offersList = document.createElement(`ul`);
  const numberOfOffers = offers.length > 3 ? 3 : offers.length;

  for (let i = 0; i < numberOfOffers; i++) {
    const currentOffer = offers[i];
    const {title: offerTitle, price: offerPrice} = currentOffer;
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
                <h3 class="event__title">${type.charAt(0).toUpperCase() + type.slice(1)} ${getPreposition(type)} ${destination.name}</h3>

                <div class="event__schedule">
                  <p class="event__time">
                    <time class="event__start-time" datetime="${formatDate(start)}">${formatTime(start)}</time>
                    &mdash;
                    <time class="event__end-time" datetime="${formatDate(finish)}">${formatTime(finish)}</time>
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

export default class TripEvent extends AbstractComponent {
  constructor(tripEvent) {
    super();
    this._event = tripEvent;
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  setEditButtonHandler(cb) {
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
  }
}
