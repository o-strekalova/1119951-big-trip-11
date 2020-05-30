import TripEvent from "../components/trip-event.js";
import EditForm from "../components/edit-form.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`,
};

export const EmptyPoint = {
  price: ``,
  start: new Date(),
  finish: new Date(),
  destination: ``,
  isFavorite: false,
  offers: [],
  type: `taxi`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange, offersAll, destinationsAll) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;
    this._event = null;
    this._offersAll = offersAll;
    this._destinationsAll = destinationsAll;

    this._tripEventComponent = null;
    this._editFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent, mode) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldEditFormComponent = this._editFormComponent;
    this._mode = mode;
    this._event = tripEvent;

    this._tripEventComponent = new TripEvent(tripEvent);
    this._editFormComponent = new EditForm(tripEvent, this._mode, this._offersAll, this._destinationsAll);

    this._tripEventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editFormComponent.getData();
      this._editFormComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._editFormComponent.blockForm();

      this._onDataChange(this, tripEvent, data);
    });

    this._editFormComponent.setResetHandler(() => {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      } else {
        this._editFormComponent.setData({
          deleteButtonText: `Deleting...`,
        });
        this._editFormComponent.blockForm();

        this._onDataChange(this, tripEvent, null);
      }
    });

    this._editFormComponent.setRollUpHandler(() => {
      this._replaceEditToEvent();
      this._editFormComponent.reset();
    });

    this._editFormComponent.setFavoriteButtonClickHandler(() => {
      this._event = Object.assign({}, this._event, {
        isFavorite: !tripEvent.isFavorite,
      });
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEditFormComponent && oldTripEventComponent) {
          replace(this._tripEventComponent, oldTripEventComponent);
          replace(this._editFormComponent, oldEditFormComponent);
        } else {
          render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEditFormComponent && oldTripEventComponent) {
          remove(oldTripEventComponent);
          remove(oldEditFormComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editFormComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
  }

  destroy() {
    remove(this._editFormComponent);
    remove(this._tripEventComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._editFormComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    this._editFormComponent.getElement().style.boxShadow = `0px 0px 20px 5px rgba(207,24,24,0.75)`;

    setTimeout(() => {
      this._editFormComponent.getElement().style.animation = ``;

      this._editFormComponent.unblockForm();
      this._editFormComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replaceEventToEdit() {
    this._onViewChange();
    replace(this._editFormComponent, this._tripEventComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToEvent() {
    replace(this._tripEventComponent, this._editFormComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      } else {
        this._replaceEditToEvent();
        this._editFormComponent.reset();
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
