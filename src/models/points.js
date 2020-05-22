/* import {getTasksByFilter} from "../utils/filter.js";
import {FilterType} from "../const.js";*/

export default class PointsModel {
  constructor() {
    this._tripEvents = [];
    /* this._activeFilterType = FilterType.ALL; */

    // this._dataChangeHandlers = [];
    /* this._filterChangeHandlers = []; */
  }

  getPoints() {
    return this._tripEvents;
    /* return getTasksByFilter(this._tasks, this._activeFilterType); */
  }

  /* getPointsAll() {
    return this._tripEvents;
  }*/

  setPoints(tripEvents) {
    this._tripEvents = Array.from(tripEvents);
    // this._callHandlers(this._dataChangeHandlers);
  }

  updatePoint(id, newData, pointController) {
    const index = this._tripEvents.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tripEvents = [].concat(this._tripEvents.slice(0, index), newData, this._tripEvents.slice(index + 1));
    pointController.render(this._tripEvents[index]);

    /* this._callHandlers(this._dataChangeHandlers);

    return true; */
  }

  /* setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  removeTask(id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  } */

  /* _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }*/
}
