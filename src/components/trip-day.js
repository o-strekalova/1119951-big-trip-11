import {MONTHS, deconstructDate, createElement} from "./../utils.js";

const createTripDayTemplate = (date, count) => {

  let deconstrutedDate = deconstructDate(date);
  let {year, month, day} = deconstrutedDate;
  let datetime = `${year}-${month}-${day}`;

  return (
    `<li class="trip-days__item  day">
      <div class="day__info">
        <span class="day__counter">${count}</span>
        <time class="day__date" datetime="${datetime}">${MONTHS[month]} ${day}</time>
      </div>

      <ul class="trip-events__list">
      </ul>
    </li>`
  );
};

export default class TripDay {
  constructor(date, count) {
    this._date = date;
    this._count = count;
    this._element = null;
  }

  getTemplate() {
    return createTripDayTemplate(this._date, this._count);
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
