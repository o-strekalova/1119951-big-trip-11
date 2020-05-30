import Sort, {SortType} from "../components/sort.js";
import DaysList from "../components/days-list.js";
import TripDay from "../components/trip-day.js";
import NoEvents from "../components/no-events.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "../controllers/point.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const addPointButton = document.querySelector(`.trip-main__event-add-btn`);
let pointControllers = [];

const renderDays = (daysListElement, tripEvents, onDataChange, onViewChange, offersAll, destinationsAll) => {
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
      const pointController = new PointController(events[count - 2], onDataChange, onViewChange, offersAll, destinationsAll);
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
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._pointControllers = pointControllers;
    this._tripEvents = [];
    this._offersAll = [];
    this._destinationsAll = [];
    this._creatingPoint = null;
    this._sortType = SortType.EVENT;

    this._sort = new Sort();
    this._daysList = new DaysList();
    this._noEvents = null;
    this._fail = null;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this.onAddButtonClick = this.onAddButtonClick.bind(this);

    this._sort.setSortTypeChangeHandler(this._onSortTypeChange);
    this._pointsModel.setFilterChangeHandler(this._onFilterChange);
    this._setOffers();
    this._setDestinations();
  }

  _setOffers() {
    this._api.getOffers()
      .then((offers) => {
        this._offersAll = offers;
      });
  }

  _setDestinations() {
    this._api.getDestinations()
      .then((destinations) => {
        this._destinationsAll = destinations;
      })
      .catch(() => {
        this._fail = new NoEvents(`Failed to load destinations.\n Impossible to add point.`);
      });
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

    if (this._tripEvents.length === 0 && this._fail === null) {
      this._noEvents = new NoEvents(`Click New Event to create your first point`);
      render(this._container.getElement(), this._noEvents, RenderPosition.BEFOREEND);
      return;
    } else if (this._tripEvents.length === 0 && this._fail !== null) {
      addPointButton.setAttribute(`disabled`, `disabled`);
      render(this._container.getElement(), this._fail, RenderPosition.BEFOREEND);
      return;
    }

    const eventsTitleElement = this._container.getElement().querySelector(`h2`);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(this._container.getElement(), this._daysList, RenderPosition.BEFOREEND);
    renderDays(this._daysList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
  }

  createPoint() {
    if (this._creatingPoint) {
      this._creatingPoint = null;
      return;
    }

    this._onViewChange();
    this._pointsModel.resetFilter();
    this._onFilterChange();
    render(this._container.getElement(), this._daysList, RenderPosition.BEFOREEND);
    this._creatingPoint = new PointController(this._daysList.getElement(), this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
    this._creatingPoint.render(EmptyPoint, PointControllerMode.ADDING);
    addPointButton.setAttribute(`disabled`, `disabled`);
  }

  onAddButtonClick() {
    if (this._noEvents) {
      remove(this._noEvents);
    }
    this.createPoint();
    addPointButton.removeEventListener(`click`, this.onAddButtonClick);
  }

  _renderPoints(sortType) {
    const sortedEvents = getSortedEvents(this._tripEvents, sortType);
    this._daysList.getElement().innerHTML = ``;

    if (sortType === SortType.EVENT) {
      renderDays(this._daysList.getElement(), this._tripEvents, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
    } else {
      render(this._daysList.getElement(), new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
      const dayInfo = this._daysList.getElement().querySelector(`.day__info`);
      dayInfo.innerHTML = ``;
      const eventsList = this._daysList.getElement().querySelector(`.trip-events__list`);
      sortedEvents.map((tripEvent) => {
        const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
        pointController.render(tripEvent, PointControllerMode.DEFAULT);
        this._pointControllers.push(pointController);
      });
    }
  }

  _updateAddButton() {
    if (addPointButton.disabled && this._destinationsAll.length > 0) {
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
        this._api.createPoint(newData)
          .then((pointModel) => {
            this._pointsModel.addPoint(pointModel);
            this._updatePoints();
            this._updateAddButton();
          })
          .catch(() => {
            pointController.shake();
          });
      }
    } else if (newData === null) {
      this._api.deletePoint(oldData.id)
        .then(() => {
          this._pointsModel.removePoint(oldData.id);
          this._updatePoints();
        })
        .catch(() => {
          pointController.shake();
        });
    } else {
      this._api.updatePoint(oldData.id, newData)
        .then((pointModel) => {
          this._pointsModel.updatePoint(oldData.id, pointModel);
          this._updatePoints();
          this._creatingPoint = null;
          this._updateAddButton();
        })
        .catch(() => {
          pointController.shake();
        });
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
