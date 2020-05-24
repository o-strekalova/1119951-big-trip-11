import TripInfo from "../components/trip-info.js";
import Sort, {SortType} from "../components/sort.js";
import TripList from "../components/trip-list.js";
import TripDay from "../components/trip-day.js";
import NoEvents from "../components/no-events.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";

const addPointButton = document.querySelector(`.trip-main__event-add-btn`);
let pointControllers = [];

const renderDays = (tripListElement, tripEvents, onDataChange, onViewChange) => {
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
      pointController.render(dateEvent, PointControllerMode.DEFAULT);

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
  constructor(container, pointsModel) {
    this._container = container;
    this._pointsModel = pointsModel;

    this._pointControllers = pointControllers;
    this._tripEvents = [];
    this._creatingPoint = null;

    this._sort = new Sort();
    this._tripList = new TripList();
    this._noEvents = new NoEvents();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onAddButtonClick = this.onAddButtonClick.bind(this);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    this._tripEvents = this._pointsModel.getPoints();
    const tripEventsElement = document.querySelector(`.trip-events`);
    const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);

    if (this._tripEvents.length === 0) {
      render(eventsTitleElement, this._noEvents, RenderPosition.AFTER);
      return;
    }

    const tripInfoElement = this._container.querySelector(`.trip-info`);
    render(tripInfoElement, new TripInfo(this._tripEvents), RenderPosition.AFTERBEGIN);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(tripEventsElement, this._tripList, RenderPosition.BEFOREEND);
    renderDays(this._tripList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange);
  }

  createPoint() {
    if (this._creatingPoint) {
      this._creatingPoint = null;
      return;
    }

    this._pointsModel.resetFilter();
    this._creatingPoint = new PointController(this._tripList.getElement(), this._onDataChange, this._onViewChange);
    this._pointControllers.forEach((it) => it.setDefaultView());
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    addPointButton.setAttribute(`disabled`, `disabled`);
  }

  onAddButtonClick() {
    this.createPoint();
    addPointButton.setAttribute(`disabled`, `disabled`);
    addPointButton.removeEventListener(`click`, this.onAddButtonClick);
  }

  _updateAddButton() {
    addPointButton.removeAttribute(`disabled`, `disabled`);
    addPointButton.addEventListener(`click`, this.onAddButtonClick);
  }

  _removeDays() {
    this._tripList.getElement().innerHTML = ``;
    this._pointControllers = [];
  }

  _updatePoints() {
    this._removeDays();
    this._tripEvents = this._pointsModel.getPoints();
    renderDays(this._tripList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange);
  }

  _onFilterChange() {
    this._updatePoints();
    this._onSortTypeChange(SortType.EVENT);
    this._sort.resetSortType();
  }

  _onDataChange(pointController, oldData, newData) {
    if (oldData === EmptyPoint) {
      this._creatingPoint = null;
      if (newData === null) {
        pointController.destroy();
        this._updateAddButton();
      } else {
        this._pointsModel.addPoint(newData);
        this._updatePoints();
        this._updateAddButton();
      }
    } else if (newData === null) {
      this._pointsModel.removePoint(oldData.id);
      this._updatePoints();
    } else {
      this._pointsModel.updatePoint(oldData.id, newData);
      this._updatePoints();
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._pointControllers = [];
    const sortedEvents = getSortedEvents(this._tripEvents, sortType);
    this._tripList.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      renderDays(this._tripList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange);
    } else {
      render(this._tripList.getElement(), new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
      const dayInfo = this._tripList.getElement().querySelector(`.day__info`);
      dayInfo.innerHTML = ``;
      const eventsList = this._tripList.getElement().querySelector(`.trip-events__list`);
      sortedEvents.map((tripEvent) => {
        const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange);
        pointController.render(tripEvent, PointControllerMode.DEFAULT);
        this._pointControllers.push(pointController);
      });
    }
  }
}
