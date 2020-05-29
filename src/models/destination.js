export default class Destination {
  constructor(data) {
    this.name = data[`name`];
    this.description = data[`description`];
    this.pictures = data[`pictures`];
  }

  static parseDestination(data) {
    return new Destination(data);
  }

  static parseDestinations(data) {
    return data.map(Destination.parseDestination);
  }
}
