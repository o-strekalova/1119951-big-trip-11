import {MONTHS, deconstructDate} from "./../utils/common.js";
import AbstractComponent from "./abstract-component.js";

const createTripInfoTemplate = (tripEvents) => {
  let cities = [];

  tripEvents.map((tripEvent) => {
    let {destination} = tripEvent;
    cities.push(destination);
  });

  let middleValue = cities.length > 3 ? `...` : cities[1];

  let firstDate = deconstructDate(tripEvents[0].start);
  let {month: firstMonth, day: firstDay} = firstDate;
  let lastDate = deconstructDate(tripEvents[tripEvents.length - 1].finish);
  let {month: lastMonth, day: lastDay} = lastDate;

  return (
    `<div class="trip-info__main">
      <h1 class="trip-info__title">${cities[0]} &mdash; ${middleValue} &mdash; ${cities[cities.length - 1]}</h1>

      <p class="trip-info__dates">${firstDay} ${MONTHS[firstMonth]}&nbsp;&mdash;&nbsp;${lastDay} ${MONTHS[lastMonth]}</p>
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
