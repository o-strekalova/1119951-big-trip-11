import TripCost from "./components/trip-cost.js";
import SiteMenu from "./components/site-menu.js";
import FilterController from "./controllers/filter.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {tripEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);

render(tripMainElement, new TripCost(tripEvents), RenderPosition.AFTERBEGIN);
render(controlsTitleElement, new SiteMenu(), RenderPosition.AFTER);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripEvents);

const filterController = new FilterController(tripControlsElement, pointsModel);
filterController.render();

const trip = new TripController(tripMainElement, pointsModel);
trip.render();

const addPointButton = tripMainElement.querySelector(`.trip-main__event-add-btn`);
addPointButton.addEventListener(`click`, trip.onAddButtonClick);
