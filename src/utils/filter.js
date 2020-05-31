export const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`,
};

export const getFuturePoints = (points, date) => {
  return points.filter((point) => {
    return point.start > date;
  });
};

export const getPastPoints = (points, date) => {
  return points.filter((point) => {
    return point.end < date;
  });
};

export const getPointsByFilter = (points, filterType) => {
  const nowDate = new Date();

  switch (filterType) {
    case FilterType.EVERYTHING:
      return points;
    case FilterType.FUTURE:
      return getFuturePoints(points, nowDate);
    case FilterType.PAST:
      return getPastPoints(points, nowDate);
  }
  return points;
};
