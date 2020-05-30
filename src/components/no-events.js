import AbstractComponent from "./abstract-component.js";

// const noPointsMessage = `Click New Event to create your first point`;

const createNoEventsTemplate = (message) => {
  return (
    `<p class="trip-events__msg">
      ${message}
    </p>`
  );
};

export default class NoEvents extends AbstractComponent {
  constructor(message) {
    super();

    this._message = message;
  }

  getTemplate() {
    return createNoEventsTemplate(this._message);
  }
}
