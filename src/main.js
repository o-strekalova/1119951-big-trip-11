import {createTripInfoTemplate} from "./components/trip-info.js";
import {createTripCostTemplate} from "./components/trip-cost.js";
import {createSiteMenuTemplate} from "./components/site-menu.js";
import {createFilterTemplate} from "./components/filter.js";
import {createSortingTemplate} from "./components/sorting.js";
import {createEditFormTemplate} from "./components/edit-form.js";
import {createTripListTemplate} from "./components/trip-list.js";
import {createTripDayTemplate} from "./components/trip-day.js";

const DAYS_COUNT = 3;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripCostTemplate());

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
render(controlsTitleElement, createSiteMenuTemplate(), `afterend`);
render(tripControlsElement, createFilterTemplate());

const tripEventsElement = document.querySelector(`.trip-events`);
const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);
render(eventsTitleElement, createSortingTemplate(), `afterend`);
render(tripEventsElement, createEditFormTemplate());
render(tripEventsElement, createTripListTemplate());

const tripListElement = tripEventsElement.querySelector(`.trip-days`);

for (let i = 0; i < DAYS_COUNT; i++) {
  render(tripListElement, createTripDayTemplate());
}
