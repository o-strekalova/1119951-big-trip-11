import Point from "../components/point.js";
import EditPoint from "../components/edit-point.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;
const ONE_SECOND = 1000;

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
    this._point = null;
    this._offersAll = offersAll;
    this._destinationsAll = destinationsAll;

    this._pointComponent = null;
    this._editPointComponent = null;
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToPoint();
    }
  }

  render(point, mode) {
    const oldPointComponent = this._pointComponent;
    const oldEditPointComponent = this._editPointComponent;
    this._mode = mode;
    this._point = point;

    this._pointComponent = new Point(point);
    this._editPointComponent = new EditPoint(point, this._mode, this._offersAll, this._destinationsAll);

    this._pointComponent.setEditButtonHandler(() => {
      this._replacePointToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    });

    this._editPointComponent.setSubmitHandler((evt) => {
      evt.preventDefault();
      const data = this._editPointComponent.getData();
      this._editPointComponent.setData({
        saveButtonText: `Saving...`,
      });
      this._editPointComponent.block();

      this._onDataChange(this, point, data);
    });

    this._editPointComponent.setResetHandler(() => {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      } else {
        this._editPointComponent.setData({
          deleteButtonText: `Deleting...`,
        });
        this._editPointComponent.block();

        this._onDataChange(this, point, null);
      }
    });

    this._editPointComponent.setRollUpHandler(() => {
      this._replaceEditToPoint();
      this._editPointComponent.reset();
    });

    this._editPointComponent.setFavoriteButtonClickHandler(() => {
      this._point = Object.assign({}, this._point, {
        isFavorite: !point.isFavorite,
      });
    });

    switch (mode) {
      case Mode.DEFAULT:
        if (oldEditPointComponent && oldPointComponent) {
          replace(this._pointComponent, oldPointComponent);
          replace(this._editPointComponent, oldEditPointComponent);
        } else {
          render(this._container, this._pointComponent, RenderPosition.BEFOREEND);
        }
        break;
      case Mode.ADDING:
        if (oldEditPointComponent && oldPointComponent) {
          remove(oldPointComponent);
          remove(oldEditPointComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        render(this._container, this._editPointComponent, RenderPosition.AFTERBEGIN);
        break;
    }
  }

  destroy() {
    remove(this._editPointComponent);
    remove(this._pointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  shake() {
    this._editPointComponent.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / ONE_SECOND}s`;
    this._editPointComponent.getElement().style.boxShadow = `0px 0px 20px 5px rgba(207,24,24,0.75)`;

    setTimeout(() => {
      this._editPointComponent.getElement().style.animation = ``;
      this._editPointComponent.getElement().style.boxShadow = ``;

      this._editPointComponent.unblock();
      this._editPointComponent.setData({
        saveButtonText: `Save`,
        deleteButtonText: `Delete`,
      });
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _replacePointToEdit() {
    this._onViewChange();
    replace(this._editPointComponent, this._pointComponent);
    this._mode = Mode.EDIT;
  }

  _replaceEditToPoint() {
    replace(this._pointComponent, this._editPointComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);

    this._mode = Mode.DEFAULT;
  }

  _onEscKeyDown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;
    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyPoint, null);
      } else {
        this._replaceEditToPoint();
        this._editPointComponent.reset();
      }
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
