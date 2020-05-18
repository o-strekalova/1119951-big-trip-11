import TripEvent from "../components/trip-event.js";
import EditForm from "../components/edit-form.js";
import {render, RenderPosition, replace} from "../utils/render.js";

const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`,
};

export default class PointController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._tripEventComponent = null;
    this._editFormComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  render(tripEvent) {
    const oldTripEventComponent = this._tripEventComponent;
    const oldEditFormComponent = this._editFormComponent;

    this._tripEventComponent = new TripEvent(tripEvent);
    this._editFormComponent = new EditForm(tripEvent);

    this._tripEventComponent.setEditButtonHandler(() => {
      this._replaceEventToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editFormComponent.setSubmitHandler(() => {
      this._replaceEditToEvent();
    });

    this._editFormComponent.setResetHandler(() => {
      this._replaceEditToEvent();
    });

    this._editFormComponent.setRollUpHandler(() => {
      this._replaceEditToEvent();
    });

    this._editFormComponent.setFavoriteButtonClickHandler(() => {
      this._onDataChange(this, tripEvent, Object.assign({}, tripEvent, {
        isFavorite: !tripEvent.isFavorite,
      }));
    });

    if (oldEditFormComponent && this._tripEventComponent) {
      replace(this._tripEventComponent, oldTripEventComponent);
      replace(this._editFormComponent, oldEditFormComponent);
    } else {
      render(this._container, this._tripEventComponent, RenderPosition.BEFOREEND);
    }
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToEvent();
    }
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
      this._replaceEditToEvent();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
