import TripInfo from "../components/trip-info.js";
import Sort, {SortType} from "../components/sort.js";
import TripList from "../components/trip-list.js";
import TripDay from "../components/trip-day.js";
import NoEvents from "../components/no-events.js";
import PointController from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";

const tripEventsElement = document.querySelector(`.trip-events`);
let pointControllers = [];

const renderDays = (tripEvents, onDataChange, onViewChange) => {
  const tripListElement = tripEventsElement.querySelector(`.trip-days`);
  let allDates = Array.from(tripEvents, ({start}) => start.toDateString());
  let days = [...new Set(allDates)];

  let count = 1;

  for (let day of days) {
    day = new Date(day);
    render(tripListElement, new TripDay(day, count++), RenderPosition.BEFOREEND);
    let events = tripListElement.querySelectorAll(`.trip-events__list`);
    let dateEvents = tripEvents.slice().filter((tripEvent) => tripEvent.start.toDateString() === day.toDateString());
    dateEvents.map((dateEvent) => {
      const pointController = new PointController(events[count - 2], onDataChange, onViewChange);
      pointController.render(dateEvent);
      pointControllers.push(pointController);
    });
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
    this._tripEvents = [];
    this._pointControllers = pointControllers;

    this._sort = new Sort();
    this._tripList = new TripList();
    this._noEvents = new NoEvents();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tripEvents) {
    this._tripEvents = tripEvents;
    const tripMainElement = document.querySelector(`.trip-main`);
    const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);

    if (tripEvents.length === 0) {
      render(eventsTitleElement, this._noEvents, RenderPosition.AFTER);
      return;
    }

    const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
    render(tripInfoElement, new TripInfo(this._tripEvents), RenderPosition.AFTERBEGIN);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(tripEventsElement, this._tripList, RenderPosition.BEFOREEND);
    renderDays(this._tripEvents, this._onDataChange, this._onViewChange);
  }

  _onDataChange(pointController, oldData, newData) {
    const index = this._tripEvents.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), newData, this._tripEvents.slice(index + 1));
    pointController.render(this._tripEvents[index]);
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    const sortedEvents = getSortedEvents(this._tripEvents, sortType);
    const tripListElement = tripEventsElement.querySelector(`.trip-days`);
    tripListElement.innerHTML = ``;

    if (sortType === SortType.EVENT) {
      renderDays(this._tripEvents, this._onDataChange, this._onViewChange);
    } else {
      render(tripListElement, new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
      const dayInfo = tripListElement.querySelector(`.day__info`);
      dayInfo.innerHTML = ``;
      const eventsList = tripListElement.querySelector(`.trip-events__list`);
      sortedEvents.map((tripEvent) => {
        const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange);
        pointController.render(tripEvent);

        return pointController;
      });
    }
  }
}
