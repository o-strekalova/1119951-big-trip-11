import Sort, {SortType} from "../components/sort.js";
import DaysList from "../components/days-list.js";
import TripDay from "../components/trip-day.js";
import NoEvents from "../components/no-events.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "../controllers/point.js";
import {render, RenderPosition} from "../utils/render.js";

const addPointButton = document.querySelector(`.trip-main__event-add-btn`);
let pointControllers = [];

const renderDays = (daysListElement, tripEvents, onDataChange, onViewChange) => {
  const sortedEvents = tripEvents.slice().sort((a, b) => a.start - b.start);
  let allDates = Array.from(sortedEvents, ({start}) => start.toDateString());
  let days = [...new Set(allDates)];

  let count = 1;

  for (let day of days) {
    day = new Date(day);
    render(daysListElement, new TripDay(day, count++), RenderPosition.BEFOREEND);
    let events = daysListElement.querySelectorAll(`.trip-events__list`);
    let dateEvents = sortedEvents.slice().filter((tripEvent) => tripEvent.start.toDateString() === day.toDateString());
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
    this._sortType = SortType.EVENT;

    this._sort = new Sort();
    this._daysList = new DaysList();
    this._noEvents = new NoEvents();

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onAddButtonClick = this.onAddButtonClick.bind(this);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
  }

  hide() {
    this._container.hide();
    this._onSortTypeChange(SortType.EVENT);
    this._sort.resetSortType();
  }

  show() {
    this._container.show();
  }

  render() {
    this._tripEvents = this._pointsModel.getPoints();
    const tripEventsElement = document.querySelector(`.trip-events`);
    const eventsTitleElement = tripEventsElement.querySelector(`.trip-events h2`);

    if (this._tripEvents.length === 0) {
      render(eventsTitleElement, this._noEvents, RenderPosition.AFTER);
      return;
    }

    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(tripEventsElement, this._daysList, RenderPosition.BEFOREEND);
    renderDays(this._daysList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange);
  }

  createPoint() {
    if (this._creatingPoint) {
      this._creatingPoint = null;
      return;
    }

    this._onViewChange();
    this._pointsModel.resetFilter();
    this._onFilterChange();
    this._creatingPoint = new PointController(this._daysList.getElement(), this._onDataChange, this._onViewChange);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    addPointButton.setAttribute(`disabled`, `disabled`);
  }

  onAddButtonClick() {
    this.createPoint();
    addPointButton.removeEventListener(`click`, this.onAddButtonClick);
  }

  _renderPoints(sortType) {
    const sortedEvents = getSortedEvents(this._tripEvents, sortType);
    this._daysList.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      renderDays(this._daysList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange);
    } else {
      render(this._daysList.getElement(), new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
      const dayInfo = this._daysList.getElement().querySelector(`.day__info`);
      dayInfo.innerHTML = ``;
      const eventsList = this._daysList.getElement().querySelector(`.trip-events__list`);
      sortedEvents.map((tripEvent) => {
        const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange);
        pointController.render(tripEvent, PointControllerMode.DEFAULT);
        this._pointControllers.push(pointController);
      });
    }
  }

  _updateAddButton() {
    if (addPointButton.disabled) {
      this._creatingPoint = null;
      addPointButton.removeAttribute(`disabled`, `disabled`);
      addPointButton.addEventListener(`click`, this.onAddButtonClick);
    }
  }

  _removeDays() {
    this._daysList.getElement().innerHTML = ``;
  }

  _updatePoints() {
    this._removeDays();
    this._tripEvents = this._pointsModel.getPoints();
    this._renderPoints(this._sortType);
  }

  _onFilterChange() {
    this._updatePoints();
    this._sort.resetSortType();
    this._onSortTypeChange(SortType.EVENT);
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
      this._creatingPoint = null;
      this._updateAddButton();
    }
  }

  _onViewChange() {
    this._pointControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._sortType = sortType;
    this._updateAddButton();
    this._renderPoints(this._sortType);
  }
}
