import AbstractComponent from "./abstract-component.js";

const createTripListTemplate = () => {
  return (
    `<section class="trip-events">
      <h2 class="visually-hidden">Trip events</h2>
    </section>`
  );
};

export default class TripList extends AbstractComponent {
  getTemplate() {
    return createTripListTemplate();
  }
}
