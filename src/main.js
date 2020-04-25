import TripInfo from "./components/trip-info.js";
import TripCost from "./components/trip-cost.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import Sort from "./components/sort.js";
import EditForm from "./components/edit-form.js";
import TripList from "./components/trip-list.js";
import TripDay from "./components/trip-day.js";
import TripEvent from "./components/trip-event.js";
import {tripEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils.js";

const renderEvent = (tripEvent, currentEventsList) => {
  const replaceEventToEdit = () => {
    currentEventsList.replaceChild(editFormComponent.getElement(), tripEventComponent.getElement());
    editForm.addEventListener(`submit`, replaceEditToEvent);
  };

  const replaceEditToEvent = () => {
    currentEventsList.replaceChild(tripEventComponent.getElement(), editFormComponent.getElement());
    editForm.removeEventListener(`submit`, replaceEditToEvent);
  };

  const tripEventComponent = new TripEvent(tripEvent);
  const editButton = tripEventComponent.getElement().querySelector(`.event__rollup-btn`);
  editButton.addEventListener(`click`, replaceEventToEdit);

  const editFormComponent = new EditForm(tripEvent);
  const editForm = editFormComponent.getElement();

  render(currentEventsList, tripEventComponent.getElement(), RenderPosition.BEFOREEND);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, new TripInfo(tripEvents).getElement(), RenderPosition.AFTERBEGIN);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripCost(tripEvents).getElement(), RenderPosition.BEFOREEND);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
render(controlsTitleElement, new SiteMenu().getElement(), RenderPosition.AFTER);
render(tripControlsElement, new Filter().getElement(), RenderPosition.BEFOREEND);

const tripEventsElement = document.querySelector(`.trip-events`);
const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);
render(eventsTitleElement, new Sort().getElement(), RenderPosition.AFTER);
render(tripEventsElement, new TripList().getElement(), RenderPosition.BEFOREEND);

const tripListElement = tripEventsElement.querySelector(`.trip-days`);

let allDates = Array.from(tripEvents, ({start}) => start.toDateString());
let days = [...new Set(allDates)];

let count = 1;

for (let day of days) {
  day = new Date(day);
  render(tripListElement, new TripDay(day, count++).getElement(), RenderPosition.BEFOREEND);
  let events = tripListElement.querySelectorAll(`.trip-events__list`);
  let dateEvents = tripEvents.slice().filter((tripEvent) => tripEvent.start.toDateString() === day.toDateString());
  dateEvents.map((dateEvent) => renderEvent(dateEvent, events[count - 2]));
}
