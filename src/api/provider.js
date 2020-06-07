import Point from "../models/point";
import Offer from "../models/offer";
import Destination from "../models/destination";

const isOnline = () => {
  return window.navigator.onLine;
};

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
    .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, pointsStore, offersStore, destinationsStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          const items = offers.map((offer) => offer.toRAW());
          this._offersStore.setItems(items);

          return offers;
        });
    }

    const storeOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(Offer.parseOffers(storeOffers));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          const items = destinations.map((destination) => destination.toRAW());
          this._destinationsStore.setItems(items);

          return destinations;
        });
    }

    const storeDestinations = Object.values(this._destinationsStore.getItems());

    return Promise.resolve(Destination.parseDestination(storeDestinations));
  }


  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map((point) => point.toRAW()));
          this._pointsStore.setItems(items);

          return points;
        });
    }

    const storePoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(Point.parsePoints(storePoints));
  }

  createPoint(point) {
    if (isOnline()) {
      return this._api.createPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    this._pointsStore.setItem(point.id, point.toRAW());

    return Promise.resolve(point);
  }

  updatePoint(id, point) {
    if (isOnline()) {
      return this._api.updatePoint(id, point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, newPoint.toRAW());

          return newPoint;
        });
    }

    const localPoint = Point.clone(Object.assign(point, {id}));
    this._pointsStore.setItem(id, localPoint.toRAW());

    return Promise.resolve(localPoint);
  }

  deletePoint(id) {
    if (isOnline()) {
      return this._api.deletePoint(id)
        .then(() => this._pointsStore.removeItem(id));
    }

    this._pointsStore.removeItem(id);

    return Promise.resolve();
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._pointsStore.getItems());

      return this._api.sync(storePoints)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}
