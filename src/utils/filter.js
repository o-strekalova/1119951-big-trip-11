export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const getFutureEvents = (tripEvents, date) => {
  return tripEvents.filter((tripEvent) => {
    return tripEvent.start > date;
  });
};

export const getPastEvents = (tripEvents, date) => {
  return tripEvents.filter((tripEvent) => {
    return tripEvent.finish < date;
  });
};

export const getEventsByFilter = (tripEvents, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return tripEvents;
    case FilterType.FUTURE:
      return getFutureEvents(tripEvents, nowDate);
    case FilterType.PAST:
      return getPastEvents(tripEvents, nowDate);
  }
  return tripEvents;
};
