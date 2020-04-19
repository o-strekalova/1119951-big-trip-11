import {MONTHS, deconstructDate} from "./../utils.js";

export const createTripDayTemplate = (date, count) => {

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
