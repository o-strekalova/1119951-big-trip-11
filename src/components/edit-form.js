import {getPreposition} from "./../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {offersForTypes} from "./../mock/offers-for-types.js";
import {destinations} from "./../mock/destinations.js";
import {Mode} from "./../controllers/point.js";
import {createStartFlatpickr, createFinishFlatpickr} from "./../utils/flatpickr.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const TRANSPORTS = [`taxi`, `bus`, `train`, `ship`, `transport`, `drive`, `flight`];
const ACTIVITIES = [`check-in`, `sightseeing`, `restaurant`];
const DESTINATIONS = [`Amsterdam`, `Geneva`, `Chamonix`, `Saint-Petersburg`];
let currentID = 0;

const createTypeInputMarkup = (eventTypes, checkedType) => {
  return eventTypes
    .map((eventType) => {
      const isChecked = eventType === checkedType;
      return (
        `<div class="event__type-item">
          <input id="event-type-${eventType}-${currentID}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${currentID}">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createDestinationSelectMarkup = (allDestinations, selectedDestination) => {
  return allDestinations
    .map((destination) => {
      const isSelected = destination === selectedDestination;
      return (
        `<option value="${destination}" ${isSelected ? `selected` : ``}>${destination}</option>`
      );
    })
    .join(`\n`);
};

const createOffersMarkup = (availableOffers, chosenOffers) => {
  return availableOffers
    .map((offer) => {
      const isOfferChecked = chosenOffers.indexOf(offer) >= 0;
      const {title: offerTitle, price: offerPrice} = offer;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-${currentID}" type="checkbox" name="event-offer" value="${offerTitle}" ${isOfferChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offerTitle}-${currentID}">
            <span class="event__offer-title">${offerTitle}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createEditFormTemplate = (tripEvent, mode) => {
  currentID++;
  const {type, destination, offers: chosenOffers, price, isFavorite} = tripEvent;
  const chosenDestination = destination ? destinations.find((it) => it.name === destination) : Object.assign({}, {name: ``});
  const chosenTypeOfOffers = offersForTypes.find((it) => it.type === type);
  const availableOffers = chosenTypeOfOffers.offers;

  let destinationSection = ``;
  if (destination) {
    const picturesList = document.createElement(`div`);
    for (let i = 0; i < chosenDestination.pictures.length; i++) {
      picturesList.insertAdjacentHTML(`beforeend`, `<img class="event__photo" src="${chosenDestination.pictures[i].src}" alt="Event photo"></img>`);
    }

    destinationSection =
    `<section class="event__section  event__section--destination">
          <h3 class="event__section-title  event__section-title--destination">Destination</h3>
          <p class="event__destination-description">${chosenDestination.description}</p>

          <div class="event__photos-container">
            <div class="event__photos-tape">
              ${picturesList.innerHTML}
            </div>
          </div>
        </section>`;
  }

  const isCreatingPoint = mode === Mode.ADDING;
  const buttonsTemplate = isCreatingPoint ? `<button class="event__reset-btn" type="reset">Cancel</button>` :
    `<button class="event__reset-btn" type="reset">Delete</button>
    <input id="event-favorite-${currentID}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-${currentID}">
      <span class="visually-hidden">Add to favorite</span>
      <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
        <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
      </svg>
    </label>
    <button class="event__rollup-btn" type="button">
      <span class="visually-hidden">Open event</span>
    </button>`;

  return (
    `<form class="trip-events__item  event  event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-${currentID}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${currentID}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createTypeInputMarkup(TRANSPORTS, type)}
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createTypeInputMarkup(ACTIVITIES, type)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${currentID}">
          ${type.charAt(0).toUpperCase() + type.slice(1)} ${getPreposition(type)}
          </label>
          <select class="event__input  event__input--destination" id="event-destination-${currentID}" name="event-destination" required>
          ${createDestinationSelectMarkup(DESTINATIONS, destination)}
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${currentID}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${currentID}" type="text" name="event-start-time">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${currentID}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${currentID}" type="text" name="event-end-time">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${currentID}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${currentID}" type="number" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${buttonsTemplate}
      </header>
      <section class="event__details">
        <section class="event__section  event__section--offers">
          <h3 class="event__section-title  event__section-title--offers">Offers</h3>

          <div class="event__available-offers">
          ${createOffersMarkup(availableOffers, chosenOffers)}
          </div>
        </section>

        ${destinationSection}
      </section>
    </form>`
  );
};

export default class EditForm extends AbstractSmartComponent {
  constructor(tripEvent, mode) {
    super();
    this._event = tripEvent;
    this._type = tripEvent.type;
    this._destination = tripEvent.destination;
    this._start = tripEvent.start;
    this._finish = tripEvent.finish;
    this._price = tripEvent.price;
    this._isFavorite = tripEvent.isFavorite;
    this._offers = tripEvent.offers;

    this._mode = mode;
    this._flatpickrForStart = null;
    this._flatpickrForEnd = null;

    this._submitHandler = null;
    this._resetHandler = null;
    this._favoriteHandler = null;
    this._rollUpHandler = null;
    this._subscribeOnEvents();
    this._applyFlatpickr();
  }

  getTemplate() {
    return createEditFormTemplate(this._event, this._mode);
  }

  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this.setResetHandler(this._resetHandler);
    this.setRollUpHandler(this._rollUpHandler);
    this.setFavoriteButtonClickHandler(this._favoriteHandler);

    this._subscribeOnEvents();
  }

  rerender() {
    const oldElement = this.getElement();
    this.removeElement();
    const newElement = this.getElement();
    oldElement.replaceWith(newElement);

    this.recoveryListeners();
    this._applyFlatpickr();
  }

  reset() {
    this._event.type = this._type;
    this._event.destination = this._destination;
    this._event.start = this._start;
    this._event.finish = this._finish;
    this._event.price = this._price;
    this._event.isFavorite = this._isFavorite;
    this._event.offers = this._offers;

    this.rerender();
  }

  _parseFormData(formData) {
    const type = formData.get(`event-type`);
    const chosenTypeOfOffers = offersForTypes.find((it) => it.type === type).offers;

    const checkedOffers = formData.getAll(`event-offer`).map((offer) => {
      return chosenTypeOfOffers.find((it) => it.title === offer);
    });

    let start = this._flatpickrForStart.selectedDates[0];
    let finish = this._flatpickrForEnd.selectedDates[0];

    return {
      type,
      destination: formData.get(`event-destination`),
      start,
      finish,
      price: formData.get(`event-price`),
      isFavorite: Boolean(formData.get(`event-favorite`)),
      offers: checkedOffers,
    };
  }

  getData() {
    const form = this.getElement();
    const formData = new FormData(form);

    return this._parseFormData(formData);
  }

  setSubmitHandler(cb) {
    this.getElement().addEventListener(`submit`, cb);
    this._submitHandler = cb;
  }

  setResetHandler(cb) {
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, cb);
    this._resetHandler = cb;
  }

  setRollUpHandler(cb) {
    if (this._mode === Mode.DEFAULT) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, cb);
      this._rollUpHandler = cb;
    }
  }

  setFavoriteButtonClickHandler(cb) {
    if (this._mode === Mode.DEFAULT) {
      this.getElement().querySelector(`.event__favorite-checkbox`).addEventListener(`change`, cb);
      this._favoriteHandler = cb;
    }
  }

  _applyFlatpickr() {
    const destroyFlatpickr = (currentFlatpickr) => {
      if (currentFlatpickr) {
        currentFlatpickr.destroy();
        currentFlatpickr = null;
      }
    };

    destroyFlatpickr(this._flatpickrForStart);
    destroyFlatpickr(this._flatpickrForEnd);

    const startDateElement = this.getElement().querySelector(`#event-start-time-${currentID}`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-${currentID}`);
    const submitButton = this.getElement().querySelector(`.event__save-btn`);

    const onChange = () => {
      let start = this._flatpickrForStart.selectedDates[0];
      let finish = this._flatpickrForEnd.selectedDates[0];
      submitButton.disabled = false;
      if (start > finish) {
        submitButton.disabled = true;
      }
    };

    this._flatpickrForStart = flatpickr(startDateElement, createStartFlatpickr(this._event, onChange));
    this._flatpickrForEnd = flatpickr(endDateElement, createFinishFlatpickr(this._event, onChange));
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelectorAll(`.event__type-group`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        this._event.type = evt.target.value;
        this.rerender();
      }));

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        this._event.destination = evt.target.value;

        this.rerender();
      });
  }
}
