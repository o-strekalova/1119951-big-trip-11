import {createElement} from "./../utils.js";

const createTripCostTemplate = (tripEvents) => {
  let total = 0;

  tripEvents.map((tripEvent) => {
    let {offers, price} = tripEvent;
    total += price;

    offers.map((offer) => {
      let {offerPrice} = offer;
      total += offerPrice;
    });
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};

export default class TripCost {
  constructor(tripEvents) {
    this._events = tripEvents;
    this._element = null;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
