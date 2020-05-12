import TripInfo from "./../components/trip-info.js";
import Sort, {SortType} from "./../components/sort.js";
import EditForm from "./../components/edit-form.js";
import TripList from "./../components/trip-list.js";
import TripDay from "./../components/trip-day.js";
import TripEvent from "./../components/trip-event.js";
import NoEvents from "./../components/no-events.js";
import {render, RenderPosition} from "./../utils/render.js";

const tripEventsElement = document.querySelector(`.trip-events`);

const renderEvent = (tripEvent, currentEventsList) => {
  const replaceEventToEdit = () => {
    currentEventsList.replaceChild(editFormComponent.getElement(), tripEventComponent.getElement());
    editFormComponent.setSubmitHandler(replaceEditToEvent);
    editFormComponent.setResetHandler(replaceEditToEvent);
    document.addEventListener(`keydown`, onEscKeyDown);
    tripEventComponent.removeEditButtonHandler(replaceEventToEdit);
  };

  const replaceEditToEvent = () => {
    currentEventsList.replaceChild(tripEventComponent.getElement(), editFormComponent.getElement());
    editFormComponent.removeSubmitHandler(replaceEditToEvent);
    editFormComponent.removeResetHandler(replaceEditToEvent);
    tripEventComponent.setEditButtonHandler(replaceEventToEdit);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      replaceEditToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const tripEventComponent = new TripEvent(tripEvent);
  tripEventComponent.setEditButtonHandler(replaceEventToEdit);

  const editFormComponent = new EditForm(tripEvent);

  render(currentEventsList, tripEventComponent, RenderPosition.BEFOREEND);
};

const renderDays = (tripEvents) => {
  const tripListElement = tripEventsElement.querySelector(`.trip-days`);
  let allDates = Array.from(tripEvents, ({start}) => start.toDateString());
  let days = [...new Set(allDates)];

  let count = 1;

  for (let day of days) {
    day = new Date(day);
    render(tripListElement, new TripDay(day, count++), RenderPosition.BEFOREEND);
    let events = tripListElement.querySelectorAll(`.trip-events__list`);
    let dateEvents = tripEvents.slice().filter((tripEvent) => tripEvent.start.toDateString() === day.toDateString());
    dateEvents.map((dateEvent) => renderEvent(dateEvent, events[count - 2]));
  }
};

const getSortedEvents = (tripEvents, sortType) => {
  let sortedEvents = [];

  switch (sortType) {
    case SortType.EVENT:
      sortedEvents = tripEvents.slice().sort((a, b) => a.start - b.start);
      break;
    case SortType.TIME:
      sortedEvents = tripEvents.slice().sort((a, b) => (b.finish - b.start) - (a.finish - a.start));
      break;
    case SortType.PRICE:
      sortedEvents = tripEvents.slice().sort((a, b) => b.price - a.price);
      break;
  }

  return sortedEvents;
};

export default class TripController {
  constructor(container) {
    this._container = container;

    this._sort = new Sort();
    this._tripList = new TripList();
    this._noEvents = new NoEvents();
  }

  render(tripEvents) {
    const tripMainElement = document.querySelector(`.trip-main`);
    const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);

    if (tripEvents.length === 0) {
      render(eventsTitleElement, this._noEvents, RenderPosition.AFTER);
      return;
    }

    const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
    render(tripInfoElement, new TripInfo(tripEvents), RenderPosition.AFTERBEGIN);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(tripEventsElement, this._tripList, RenderPosition.BEFOREEND);
    renderDays(tripEvents);

    this._sort.setSortTypeChangeHandler((sortType) => {
      const sortedEvents = getSortedEvents(tripEvents, sortType);
      const tripListElement = tripEventsElement.querySelector(`.trip-days`);
      tripListElement.innerHTML = ``;

      if (sortType === SortType.EVENT) {
        renderDays(tripEvents);
      } else {
        render(tripListElement, new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
        const dayInfo = tripListElement.querySelector(`.day__info`);
        dayInfo.innerHTML = ``;
        const eventsList = tripListElement.querySelector(`.trip-events__list`);
        sortedEvents.map((tripEvent) => renderEvent(tripEvent, eventsList));
      }
    });
  }
}
