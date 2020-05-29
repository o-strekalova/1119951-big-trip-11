import AbstractComponent from "./abstract-component.js";

export const MenuItem = {
  TABLE: `Table`,
  STATS: `Stats`,
};

const createSiteMenuTemplate = () => {
  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`
  );
};

export default class SiteMenu extends AbstractComponent {
  getTemplate() {
    return createSiteMenuTemplate();
  }

  _setActiveItem(menuItem) {
    this.getElement().querySelectorAll(`.trip-tabs__btn`)
      .forEach((it) => {
        if (it.textContent === menuItem) {
          it.classList.add(`trip-tabs__btn--active`);
        } else {
          it.classList.remove(`trip-tabs__btn--active`);
        }
      });
  }

  setOnChange(handler) {
    this.getElement().addEventListener(`click`, (evt) => {
      if (evt.target.tagName !== `A`) {
        return;
      }
      const menuItem = evt.target.textContent;
      this._setActiveItem(menuItem);
      handler(menuItem);
    });
  }
}
