export const createTripCostTemplate = (tripEvents) => {
  let total = 0;

  tripEvents.map((tripEvent) => {
    let {offers, price} = tripEvent;
    total += price;

    offers.map((offer) => {
      let {offerPrice} = offer;
      total += offerPrice;
    });
  });

  return (
    `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${total}</span>
    </p>`
  );
};
