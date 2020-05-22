import TripCost from "./components/trip-cost.js";
import SiteMenu from "./components/site-menu.js";
import Filter from "./components/filter.js";
import TripList from "./components/trip-list.js";
import TripController from "./controllers/trip.js";
import PointsModel from "./models/points.js";
import {tripEvents} from "./mock/trip-event.js";
import {render, RenderPosition} from "./utils/render.js";

const tripMainElement = document.querySelector(`.trip-main`);
const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const controlsTitleElement = tripMainElement.querySelector(`.trip-controls h2`);

render(tripMainElement, new TripCost(tripEvents), RenderPosition.AFTERBEGIN);
render(controlsTitleElement, new SiteMenu(), RenderPosition.AFTER);
render(tripControlsElement, new Filter(), RenderPosition.BEFOREEND);

const pointsModel = new PointsModel();
pointsModel.setPoints(tripEvents);

const listComponent = new TripList();
const trip = new TripController(listComponent, pointsModel);
trip.render();
