import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEditFormTemplate} from "./components/edit-form.js";
import {createTripListTemplate} from "./components/trip-list.js";
import {createTripDayTemplate} from "./components/trip-day.js";
import {createTripEventTemplate} from "./components/trip-event.js";
import {tripEvents} from "./mock/trip-event.js";

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(tripEvents), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate(tripEvents));

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
render(controlsTitleElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);
const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);
render(eventsTitleElement, createSortingTemplate(), `afterend`);
render(tripEventsElement, createEditFormTemplate(tripEvents[0]));
render(tripEventsElement, createTripListTemplate());

const tripListElement = tripEventsElement.querySelector(`.trip-days`);

let allDates = Array.from(tripEvents, ({start}) => start.toDateString());
let days = [...new Set(allDates)];

let count = 1;

for (let day of days) {
  day = new Date(day);
  render(tripListElement, createTripDayTemplate(day, count++));
  let events = tripListElement.querySelectorAll(`.trip-events__list`);
  let dateEvents = tripEvents.slice(1).filter((tripEvent) => tripEvent.start.toDateString() === day.toDateString());
  dateEvents.map((dateEvent) => render(events[count - 2], createTripEventTemplate(dateEvent)));
}
