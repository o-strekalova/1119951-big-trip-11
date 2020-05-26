import TripInfo from "./components/trip-info.js";
import TripList from "./components/trip-list.js";
import TripCost from "./components/trip-cost.js";
import SiteMenu, {MenuItem} from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import StatisticsComponent from "./components/statistics.js";
import {tripEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);
const addPointButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
const pageContainerElement = document.querySelector(`.page-main .page-body__container`);

render(tripMainElement, new TripCost(tripEvents), RenderPosition.AFTERBEGIN);

const siteMenuComponent = new SiteMenu();
render(controlsTitleElement, siteMenuComponent, RenderPosition.AFTER);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, new TripInfo(tripEvents), RenderPosition.AFTERBEGIN);

const tripListComponent = new TripList();
render(pageContainerElement, tripListComponent, RenderPosition.AFTERBEGIN);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripEvents);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const tripController = new TripController(tripListComponent, pointsModel);
tripController.render();
// tripController.hide();

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
