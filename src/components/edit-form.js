import {getPreposition, TRANSPORTS, ACTIVITIES} from "./../utils/common.js";
import AbstractSmartComponent from "./abstract-smart-component.js";
import {Mode} from "./../controllers/point.js";
import {createStartFlatpickr, createFinishFlatpickr} from "./../utils/flatpickr.js";
import PointModel from "./../models/point.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const createTypeInputMarkup = (eventTypes, checkedType, id) => {
  return eventTypes
    .map((eventType) => {
      const isChecked = eventType === checkedType;
      return (
        `<div class="event__type-item">
          <input id="event-type-${eventType}-${id}" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventType}" ${isChecked ? `checked` : ``}>
          <label class="event__type-label  event__type-label--${eventType}" for="event-type-${eventType}-${id}">${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</label>
        </div>`
      );
    })
    .join(`\n`);
};

const createDestinationSelectMarkup = (destinationsAll, selectedDestination) => {
  if (destinationsAll.length > 0) {
    return destinationsAll
      .map((destination) => {
        const isSelected = destination.name === selectedDestination.name;
        return (
          `<option value="${destination.name}" ${isSelected ? `selected` : ``}>${destination.name}</option>`
        );
      })
      .join(`\n`);
  } else {
    return (
      `<option value="${selectedDestination.name}" selected>${selectedDestination.name}</option>`
    );
  }
};

const createOffersMarkup = (availableOffers, chosenOffers, id) => {
  return availableOffers
    .map((offer) => {
      const isOfferChecked = chosenOffers.some((chosenOffer) => chosenOffer.title === offer.title);
      const {title: offerTitle, price: offerPrice} = offer;
      return (
        `<div class="event__offer-selector">
          <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offerTitle}-${id}" type="checkbox" name="event-offer" value="${offerTitle}" ${isOfferChecked ? `checked` : ``}>
          <label class="event__offer-label" for="event-offer-${offerTitle}-${id}">
            <span class="event__offer-title">${offerTitle}</span>
            &plus;
            &euro;&nbsp;<span class="event__offer-price">${offerPrice}</span>
          </label>
        </div>`
      );
    })
    .join(`\n`);
};

const createEditFormTemplate = (tripEvent, mode, offersAll, destinationsAll, currentId) => {
  let {id, type, destination, offers: chosenOffers, price, isFavorite} = tripEvent;

  if (id === undefined || isNaN(Number(id))) {
    id = currentId;
  }

  let offersSection = ``;

  if (offersAll.length > 0) {
    const chosenTypeOfOffers = offersAll.find((it) => it.type === type);
    const availableOffers = chosenTypeOfOffers.offers;
    if (availableOffers.length > 0) {
      offersSection =
      `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>

        <div class="event__available-offers">
        ${createOffersMarkup(availableOffers, chosenOffers, id)}
        </div>
      </section>`;
    }
  }

  let destinationSection = ``;

  if (destination && destinationsAll.length > 0) {
    const picturesList = document.createElement(`div`);
    for (let i = 0; i < destination.pictures.length; i++) {
      picturesList.insertAdjacentHTML(`beforeend`, `<img class="event__photo" src="${destination.pictures[i].src}" alt="Event photo"></img>`);

      destinationSection =
      `<section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${picturesList.innerHTML}
              </div>
            </div>
          </section>`;
    }
  }

  const isCreatingPoint = mode === Mode.ADDING;
  const buttonsTemplate = isCreatingPoint ? `<button class="event__reset-btn" type="reset">Cancel</button>` :
    `<button class="event__reset-btn" type="reset">Delete</button>
    <input id="event-favorite-${id}" class="event__favorite-checkbox visually-hidden" type="checkbox" name="event-favorite" ${isFavorite ? `checked` : ``}>
    <label class="event__favorite-btn" for="event-favorite-${id}">
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
          <label class="event__type  event__type-btn" for="event-type-toggle-${id}">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-${id}" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Transfer</legend>
              ${createTypeInputMarkup(TRANSPORTS, type, id)}
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Activity</legend>
              ${createTypeInputMarkup(ACTIVITIES, type, id)}
            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-${id}">
          ${type.charAt(0).toUpperCase() + type.slice(1)} ${getPreposition(type)}
          </label>
          <select class="event__input  event__input--destination" id="event-destination-${id}" name="event-destination" required>
          ${createDestinationSelectMarkup(destinationsAll, destination)}
          </select>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-${id}">
            From
          </label>
          <input class="event__input  event__input--time" id="event-start-time-${id}" type="text" name="event-start-time">
          &mdash;
          <label class="visually-hidden" for="event-end-time-${id}">
            To
          </label>
          <input class="event__input  event__input--time" id="event-end-time-${id}" type="text" name="event-end-time">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-${id}">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-${id}" type="number" name="event-price" value="${price}" required>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        ${buttonsTemplate}
      </header>
      <section class="event__details">
        ${offersSection}
        ${destinationSection}
      </section>
    </form>`
  );
};

export default class EditForm extends AbstractSmartComponent {
  constructor(tripEvent, mode, offersAll, destinationsAll) {
    super();
    this._event = tripEvent;
    this._type = tripEvent.type;
    this._id = tripEvent.id;
    this._currentId = this._id;
    this._destination = tripEvent.destination;
    this._start = tripEvent.start;
    this._finish = tripEvent.finish;
    this._price = tripEvent.price;
    this._isFavorite = tripEvent.isFavorite;
    this._offers = tripEvent.offers;
    this._offersAll = offersAll;
    this._destinationsAll = destinationsAll;

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
    if (this._event.id === undefined || isNaN(Number(this._event.id))) {
      this._currentId = Math.round(Math.random() * 100);
    }

    return createEditFormTemplate(this._event, this._mode, this._offersAll, this._destinationsAll, this._currentId);
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
    this._event.id = this._id;
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
    let checkedOffers = [];

    if (this._offersAll.length > 0) {
      const chosenTypeOfOffers = this._offersAll.find((it) => it.type === type).offers;

      checkedOffers = formData.getAll(`event-offer`).map((offer) => {
        return chosenTypeOfOffers.find((it) => it.title === offer);
      });
    }

    const destinationName = formData.get(`event-destination`);
    let destination = {
      name: destinationName,
      description: ``,
      pictures: [],
    };

    if (this._destinationsAll.length > 0) {
      destination = this._destinationsAll.find((it) => it.name === destinationName);
    }

    let start = this._flatpickrForStart.selectedDates[0];
    let finish = this._flatpickrForEnd.selectedDates[0];

    if (this._id === undefined) {
      this._id = this._currentId;
    }

    return new PointModel({
      "id": this._id,
      "type": type,
      "destination": destination,
      "date_from": start,
      "date_to": finish,
      "base_price": formData.get(`event-price`),
      "is_favorite": Boolean(formData.get(`event-favorite`)),
      "offers": checkedOffers,
    });
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

    const startDateElement = this.getElement().querySelector(`#event-start-time-${this._currentId}`);
    const endDateElement = this.getElement().querySelector(`#event-end-time-${this._currentId}`);
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
        this._event.offers = [];
        this.rerender();
      }));

    element.querySelector(`.event__input--destination`)
      .addEventListener(`change`, (evt) => {
        this._event.destination = this._destinationsAll.find((it) => it.name === evt.target.value);
        this.rerender();
      });

    element.querySelectorAll(`input[name=event-start-time]`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        this._event.start = evt.target.value;
      }));

    element.querySelectorAll(`input[name=event-end-time]`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        this._event.finish = evt.target.value;
      }));

    element.querySelectorAll(`.event__input--price`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        this._event.price = evt.target.value;
      }));

    element.querySelectorAll(`.event__favorite-checkbox`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        this._event.isFavorite = evt.target.checked;
      }));

    element.querySelectorAll(`.event__offer-checkbox`)
    .forEach((it) => it
      .addEventListener(`change`, (evt) => {
        const chosenTypeOfOffers = this._offersAll.find((offersType) => offersType.type === this._event.type).offers;
        let newOffer = chosenTypeOfOffers.find((offer) => offer.title === evt.target.value);

        if (it.checked) {
          this._event.offers.push(newOffer);
        } else {
          let index = this._event.offers.indexOf(newOffer);
          this._event.offers.splice(index);
        }
      }));
  }
}
