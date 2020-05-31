import {getPointsByFilter, FilterType} from "../utils/filter.js";

export default class PointsModel {
  constructor() {
    this._points = [];
    this._activeFilterType = FilterType.EVERYTHING;

    this._filterChangeHandlers = [];
    this._resetHandlers = [];
  }

  getPoints() {
    return getPointsByFilter(this._points, this._activeFilterType);
  }

  getPointsAll() {
    return this._points;
  }

  setPoints(points) {
    this._points = Array.from(points);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setResetHandlers(handler) {
    this._resetHandlers.push(handler);
  }

  updatePoint(id, newData) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), newData, this._points.slice(index + 1));

    return true;
  }

  removePoint(id) {
    const index = this._points.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._points = [].concat(this._points.slice(0, index), this._points.slice(index + 1));

    return true;
  }

  addPoint(point) {
    this._points = [].concat(point, this._points);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  resetFilter() {
    this._activeFilterType = FilterType.EVERYTHING;
    this._callHandlers(this._resetHandlers);
  }
}
