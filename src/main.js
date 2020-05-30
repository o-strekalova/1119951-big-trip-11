import API from "./api.js";
// import TripInfo from "./components/trip-info.js";
import TripList from "./components/trip-list.js";
import NoEvents from "./components/no-events.js";
// import TripCost from "./components/trip-cost.js";
import SiteMenu, {MenuItem} from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import StatisticsComponent from "./components/statistics.js";
import {render, remove, RenderPosition} from "./utils/render.js";

// Авторизация `Basic wgHmgtWo4C11c3jCtxE1`

const AUTHORIZATION = `Basic wgHmgtWo4C11c3jCtxE1`;
const END_POINT = `https://11.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
const addPointButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const pageContainerElement = document.querySelector(`.page-main .page-body__container`);

const api = new API(END_POINT, AUTHORIZATION);
const pointsModel = new PointsModel();

// render(tripMainElement, new TripCost(pointsModel), RenderPosition.AFTERBEGIN);

const siteMenuComponent = new SiteMenu();
render(controlsTitleElement, siteMenuComponent, RenderPosition.AFTER);

// const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
// render(tripInfoElement, new TripInfo(pointsModel), RenderPosition.AFTERBEGIN);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripListComponent = new TripList();
render(pageContainerElement, tripListComponent, RenderPosition.AFTERBEGIN);

let loadScreenComponent = new NoEvents(`Loading...`);
const tripListElement = tripListComponent.getElement();
render(tripListElement, loadScreenComponent, RenderPosition.BEFOREEND);

const tripController = new TripController(tripListComponent, pointsModel, api);

addPointButton.addEventListener(`click`, tripController.onAddButtonClick);

const statisticsComponent = new StatisticsComponent(pointsModel);
render(pageContainerElement, statisticsComponent, RenderPosition.BEFOREEND);
statisticsComponent.hide();

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

api.getPoints()
  .then((points) => {
    pointsModel.setPoints(points);
    remove(loadScreenComponent);
    tripController.render();
  })
  .catch(() => {
    remove(loadScreenComponent);
    tripController.render();
  });
