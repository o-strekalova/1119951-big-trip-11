import DaysList from "../components/days-list.js";
import NoPoints from "../components/no-points.js";
import Sort, {SortType} from "../components/sort.js";
import TripDay from "../components/trip-day.js";
import PointController, {Mode as PointControllerMode, EmptyPoint} from "./point-controller.js";
import {render, RenderPosition, remove} from "../utils/render.js";

const addPointButton = document.querySelector(`.trip-main__event-add-btn`);
const pointControllers = [];

const renderDays = (daysListElement, points, onDataChange, onViewChange, offersAll, destinationsAll) => {
  const sortedPoints = points.slice().sort((a, b) => a.start - b.start);
  const allDates = Array.from(sortedPoints, ({start}) => start.toDateString());
  const days = [...new Set(allDates)];

  let count = 1;

  for (let day of days) {
    day = new Date(day);
    render(daysListElement, new TripDay(day, count++), RenderPosition.BEFOREEND);
    const eventLists = daysListElement.querySelectorAll(`.trip-events__list`);
    const datePoints = sortedPoints.slice().filter((point) => point.start.toDateString() === day.toDateString());
    datePoints.map((datePoint) => {
      const pointController = new PointController(eventLists[count - 2], onDataChange, onViewChange, offersAll, destinationsAll);
      pointController.render(datePoint, PointControllerMode.DEFAULT);

      pointControllers.push(pointController);
    });
  }
};

const getSortedPoints = (points, sortType) => {
  let sortedPoints = [];

  switch (sortType) {
    case SortType.EVENT:
      sortedPoints = points.slice().sort((a, b) => a.start - b.start);
      break;
    case SortType.TIME:
      sortedPoints = points.slice().sort((a, b) => (b.end - b.start) - (a.end - a.start));
      break;
    case SortType.PRICE:
      sortedPoints = points.slice().sort((a, b) => b.price - a.price);
      break;
  }

  return sortedPoints;
};

export default class TripController {
  constructor(container, pointsModel, api) {
    this._container = container;
    this._pointsModel = pointsModel;
    this._api = api;

    this._pointControllers = pointControllers;
    this._points = [];
    this._offersAll = [];
    this._destinationsAll = [];
    this._creatingPoint = null;
    this._sortType = SortType.EVENT;

    this._sort = new Sort();
    this._daysList = new DaysList();
    this._noPoints = null;
    this._failScreen = null;

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
        addPointButton.setAttribute(`disabled`, `disabled`);
        this._failScreen = new NoPoints(`Failed to load destinations. Impossible to add point.`);
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
    this._points = this._pointsModel.getPoints();

    if (this._points.length === 0 && this._failScreen === null) {
      this._noPoints = new NoPoints(`Click New Event to create your first point`);
      render(this._container.getElement(), this._noPoints, RenderPosition.BEFOREEND);
      return;
    } else if (this._points.length === 0 && this._failScreen !== null) {
      render(this._container.getElement(), this._failScreen, RenderPosition.BEFOREEND);
      return;
    }

    const eventsTitleElement = this._container.getElement().querySelector(`h2`);
    render(eventsTitleElement, this._sort, RenderPosition.AFTER);
    render(this._container.getElement(), this._daysList, RenderPosition.BEFOREEND);
    renderDays(this._daysList.getElement(), this._points, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
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

  _removeDays() {
    this._daysList.getElement().innerHTML = ``;
  }

  _renderPoints(sortType) {
    const sortedPoints = getSortedPoints(this._points, sortType);
    this._removeDays();

    if (sortType === SortType.EVENT) {
      renderDays(this._daysList.getElement(), this._points, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
    } else {
      render(this._daysList.getElement(), new TripDay(new Date(), ``), RenderPosition.BEFOREEND);
      const dayInfo = this._daysList.getElement().querySelector(`.day__info`);
      dayInfo.innerHTML = ``;
      const eventsList = this._daysList.getElement().querySelector(`.trip-events__list`);
      sortedPoints.map((point) => {
        const pointController = new PointController(eventsList, this._onDataChange, this._onViewChange, this._offersAll, this._destinationsAll);
        pointController.render(point, PointControllerMode.DEFAULT);
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

  _updatePoints() {
    this._removeDays();
    this._points = this._pointsModel.getPoints();
    this._renderPoints(this._sortType);
  }

  onAddButtonClick() {
    if (this._noPoints) {
      remove(this._noPoints);
    }
    this.createPoint();
    addPointButton.removeEventListener(`click`, this.onAddButtonClick);
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
