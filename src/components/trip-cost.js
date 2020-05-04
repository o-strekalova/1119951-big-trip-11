import AbstractComponent from "./abstract-component.js";

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
    `<section class="trip-main__trip-info  trip-info">
      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
      </p>
    </section>`
  );
};

export default class TripCost extends AbstractComponent {
  constructor(tripEvents) {
    super();
    this._events = tripEvents;
  }

  getTemplate() {
    return createTripCostTemplate(this._events);
  }
}
