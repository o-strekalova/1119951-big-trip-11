export default class Point {
  constructor(data) {
    this.id = data[`id`];
    this.price = Number(data[`base_price`]);
    this.start = new Date(data[`date_from`]);
    this.finish = new Date(data[`date_to`]);
    this.destination = data[`destination`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.offers = data[`offers`];
    this.type = data[`type`];
  }

  toRAW() {
    return {
      "id": this.id,
      "base_price": this.price,
      "date_from": this.start,
      "date_to": this.finish,
      "destination": this.destination,
      "is_favorite": this.isFavorite,
      "offers": this.offers,
      "type": this.type,
    };
  }

  static parsePoint(data) {
    return new Point(data);
  }

  static parsePoints(data) {
    return data.map(Point.parsePoint);
  }

  static clone(data) {
    return new Point(data.toRAW());
  }
}
