export default class Offer {
  constructor(data) {
    this.type = data[`type`];
    this.offer = data[`offers`];
  }

  static parseOffer(data) {
    return new Offer(data);
  }

  static parseOffers(data) {
    return data.map(Offer.parseOffer);
  }
}
