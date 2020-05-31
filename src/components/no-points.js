import AbstractComponent from "./abstract-component.js";

const createNoPointsTemplate = (message) => {
  return (
    `<p class="trip-events__msg">
      ${message}
    </p>`
  );
};

export default class NoPoints extends AbstractComponent {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createNoPointsTemplate(this._message);
  }
}
