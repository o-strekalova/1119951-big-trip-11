import {formatMonth} from "./../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = (tripEvents) => {
  const cities = [];

  tripEvents.map((tripEvent) => {
    const {destination} = tripEvent;
    cities.push(destination);
  });

  const middleValue = cities.length > 3 ? `...` : cities[1];

  const firstDate = formatMonth(tripEvents[0].start);
  const lastDate = formatMonth(tripEvents[tripEvents.length - 1].finish);

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${cities[0]} &mdash; ${middleValue} &mdash; ${cities[cities.length - 1]}</h1>

      <p class="trip-info__dates">${firstDate}&nbsp;&mdash;&nbsp;${lastDate}</p>
    </div>`
  );
};

export default class TripInfo extends AbstractComponent {
  constructor(tripEvents) {
    super();
    this._events = tripEvents;
  }

  getTemplate() {
    return createTripInfoTemplate(this._events);
  }
}
