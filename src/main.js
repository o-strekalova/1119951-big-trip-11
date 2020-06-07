import API from "./api/api.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import FilterController from "./controllers/filter-controller.js";
import NoPoints from "./components/no-points.js";
import PointsModel from "./models/points-model.js";
import SiteMenu, {MenuItem} from "./components/site-menu.js";
import StatisticsComponent from "./components/statistics.js";
import TripController from "./controllers/trip-controller.js";
import TripList from "./components/trip-list.js";
import {render, remove, RenderPosition} from "./utils/render.js";

const AUTHORIZATION = `Basic wgHmgtWo4C11c3jCtxE1`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;
const POINTS_STORE_PREFIX = `bigtrip-points-localstorage`;
const OFFERS_STORE_PREFIX = `bigtrip-offers-localstorage`;
const DESTINATIONS_STORE_PREFIX = `bigtrip-destinations-localstorage`;
const STORE_VER = `v1`;
const POINTS_STORE_NAME = `${POINTS_STORE_PREFIX}-${STORE_VER}`;
const OFFERS_STORE_NAME = `${OFFERS_STORE_PREFIX}-${STORE_VER}`;
const DESTINATIONS_STORE_NAME = `${DESTINATIONS_STORE_PREFIX}-${STORE_VER}`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
const addPointButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const pageContainerElement = document.querySelector(`.page-main .page-body__container`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsStore = new Store(POINTS_STORE_NAME, window.localStorage);
const offersStore = new Store(OFFERS_STORE_NAME, window.localStorage);
const destinationsStore = new Store(DESTINATIONS_STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, pointsStore, offersStore, destinationsStore);
const pointsModel = new PointsModel();
const siteMenuComponent = new SiteMenu();
const filterController = new FilterController(tripControlsElement, pointsModel);
const tripListComponent = new TripList();
const loadScreenComponent = new NoPoints(`Loading...`);
const tripController = new TripController(tripListComponent, pointsModel, apiWithProvider);
const statisticsComponent = new StatisticsComponent(pointsModel);

render(controlsTitleElement, siteMenuComponent, RenderPosition.AFTER);
filterController.render();
render(pageContainerElement, tripListComponent, RenderPosition.AFTERBEGIN);
const tripListElement = tripListComponent.getElement();
render(tripListElement, loadScreenComponent, RenderPosition.BEFOREEND);
render(pageContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

addPointButton.addEventListener(`click`, tripController.onAddButtonClick);

siteMenuComponent.setOnChange((menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      statisticsComponent.hide();
      tripController.show();
      break;
    case MenuItem.STATS:
      tripController.hide();
      statisticsComponent.show();
      break;
  }
});

apiWithProvider.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    remove(loadScreenComponent);
    tripController.render();
  })
  .catch(() => {
    remove(loadScreenComponent);
    tripController.render();
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`);
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});
