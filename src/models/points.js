import {getEventsByFilter, FilterType} from "../utils/filter.js";

export default class PointsModel {
  constructor() {
    this._tripEvents = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
    this._resetHandlers = [];
  }

  getPoints() {
    return getEventsByFilter(this._tripEvents, this._activeFilterType);
  }

  getPointsAll() {
    return this._tripEvents;
  }

  setPoints(tripEvents) {
    this._tripEvents = Array.from(tripEvents);
  }

  updatePoint(id, newData) {
    const index = this._tripEvents.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), newData, this._tripEvents.slice(index + 1));

    return true;
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removePoint(id) {
    const index = this._tripEvents.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), this._tripEvents.slice(index + 1));

    return true;
  }

  addPoint(tripEvent) {
    this._tripEvents = [].concat(tripEvent, this._tripEvents);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setResetHandlers(handler) {
    this._resetHandlers.push(handler);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  resetFilter() {
    this.setFilter(FilterType.EVERYTHING);
    this._callHandlers(this._resetHandlers);
  }
}
