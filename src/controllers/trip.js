import TripInfo from "./../components/trip-info.js";
import Sort from "./../components/sort.js";
import EditForm from "./../components/edit-form.js";
import TripList from "./../components/trip-list.js";
import TripDay from "./../components/trip-day.js";
import TripEvent from "./../components/trip-event.js";
import NoEvents from "./../components/no-events.js";
import {render, RenderPosition} from "./../utils/render.js";

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

export default class TripController {
  constructor(container) {
    this._container = container;

    this._sort = new Sort();
    this._tripList = new TripList();
    this._noEvents = new NoEvents();
  }

  render(tripEvents) {
    const tripMainElement = document.querySelector(`.trip-main`);
    const tripEventsElement = document.querySelector(`.trip-events`);
    const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);

    if (tripEvents.length === 0) {
      render(eventsTitleElement, this._noEvents, RenderPosition.AFTER);
      return;
    }

    const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
    render(tripInfoElement, new TripInfo(tripEvents), RenderPosition.AFTERBEGIN);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(tripEventsElement, this._tripList, RenderPosition.BEFOREEND);

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
  }
}
