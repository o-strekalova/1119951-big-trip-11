import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {TRANSPORT_TYPES, formatDays} from "./../utils/common.js";

const BAR_HEIGHT = 55;

const typeToEmoji = {
  "taxi": `\uD83D\uDE95`,
  "bus": `\uD83D\uDE8C`,
  "train": `\uD83D\uDE82`,
  "ship": `\uD83D\uDEF3`,
  "transport": `\uD83D\uDE8A`,
  "drive": `\uD83D\uDE97`,
  "flight": `\u2708\uFE0F`,
  "check-in": `\uD83C\uDFE8`,
  "sightseeing": `\uD83C\uDFDB`,
  "restaurant": `\uD83C\uDF74`,
};

const getUniqItems = (item, index, array) => {
  return array.indexOf(item) === index;
};

const getActiveTypes = (points) => {
  return points
    .map((point) => point.type)
    .filter(getUniqItems);
};

const addEmoji = (pointTypes) => {
  return pointTypes.map((string) => {
    return `${typeToEmoji[string]} ${string.toUpperCase()}`;
  });
};

const calcUniqCountForTransport = (points, transportType) => {
  return points.filter((point) => point.type === transportType).length;
};

const getTotalPriceForType = (points, pointType) => {
  return points
  .filter((point) => point.type === pointType)
  .map((point) => point.price)
  .reduce((a, b) => a + b);
};

const getTotalTimeForType = (points, pointType) => {
  return points
  .filter((point) => point.type === pointType)
  .map((point) => point.end - point.start)
  .reduce((a, b) => a + b);
};

const sortMoneyBars = (pointTypes, points) => {
  return pointTypes
  .map((pointType) => {
    return {
      type: pointType,
      total: getTotalPriceForType(points, pointType),
    };
  })
  .sort((a, b) => b.total - a.total);
};

const sortTransportBars = (transportTypes, points) => {
  return transportTypes
  .map((transportType) => {
    return {
      type: transportType,
      count: calcUniqCountForTransport(points, transportType),
    };
  })
  .sort((a, b) => b.count - a.count);
};

const sortTimeBars = (pointTypes, points) => {
  return pointTypes
  .map((pointType) => {
    return {
      type: pointType,
      time: getTotalTimeForType(points, pointType),
    };
  })
  .sort((a, b) => b.time - a.time);
};

const renderMoneyChart = (moneyCtx, points) => {
  const pointTypes = getActiveTypes(points);
  moneyCtx.height = BAR_HEIGHT * pointTypes.length;

  const sortedBars = sortMoneyBars(pointTypes, points);

  const labels = sortedBars.map((bar) => bar.type);
  const emojiLables = addEmoji(labels);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedBars.map((bar) => bar.total),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `€ ${val}`
        }
      },
      title: {
        display: true,
        text: `MONEY`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTransportChart = (transportCtx, points) => {
  const transportPoints = points
    .filter((point) => TRANSPORT_TYPES.indexOf(point.type) !== -1);

  const transportTypes = getActiveTypes(transportPoints);
  transportCtx.height = BAR_HEIGHT * transportTypes.length;

  const sortedBars = sortTransportBars(transportTypes, points);

  const labels = sortedBars.map((bar) => bar.type);
  const emojiLables = addEmoji(labels);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedBars.map((bar) => bar.count),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (val) => `${val}x`
        }
      },
      title: {
        display: true,
        text: `TRANSPORT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const renderTimeSpendChart = (timeSpendCtx, points) => {
  const pointTypes = getActiveTypes(points);
  timeSpendCtx.height = BAR_HEIGHT * pointTypes.length;

  const sortedBars = sortTimeBars(pointTypes, points);

  const labels = sortedBars.map((bar) => bar.type);
  const emojiLables = addEmoji(labels);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedBars.map((bar) => bar.time),
        backgroundColor: `#ffffff`,
        hoverBackgroundColor: `#ffffff`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13
          },
          color: `#000000`,
          anchor: `end`,
          align: `start`,
          formatter: (diff) => `${formatDays(diff)}`
        }
      },
      title: {
        display: true,
        text: `TIME SPENT`,
        fontColor: `#000000`,
        fontSize: 23,
        position: `left`
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#000000`,
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          minBarLength: 50
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false,
      }
    }
  });
};

const createStatisticsTemplate = () => {
  return (
    `<section class="statistics">
      <h2 class="visually-hidden">Trip statistics</h2>

      <div class="statistics__item statistics__item--money">
        <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--transport">
        <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
      </div>

      <div class="statistics__item statistics__item--time-spend">
        <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
      </div>
    </section>`
  );
};

export default class Statistics extends AbstractSmartComponent {
  constructor(pointsModel) {
    super();

    this._pointsModel = pointsModel;
    this._moneyChart = null;
    this._transportChart = null;
    this._timeSpendChart = null;

    this._renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  show() {
    super.show();
    this.rerender(this._pointsModel);
  }

  rerender(pointsModel) {
    this._pointsModel = pointsModel;
    super.rerender();

    this._renderCharts();
  }

  recoveryListeners() {}

  _renderCharts() {
    const element = this.getElement();
    const moneyCtx = element.querySelector(`.statistics__chart--money`);
    const transportCtx = element.querySelector(`.statistics__chart--transport`);
    const timeSpendCtx = element.querySelector(`.statistics__chart--time`);

    this._resetCharts();

    this._moneyChart = renderMoneyChart(moneyCtx, this._pointsModel.getPointsAll());
    this._transportChart = renderTransportChart(transportCtx, this._pointsModel.getPointsAll());
    this._timeSpendChart = renderTimeSpendChart(timeSpendCtx, this._pointsModel.getPointsAll());
  }

  _resetCharts() {
    if (this._moneyChart) {
      this._moneyChart.destroy();
      this._moneyChart = null;
    }

    if (this._colorsChart) {
      this._transportChart.destroy();
      this._transportChart = null;
    }

    if (this._timeSpendChart) {
      this._timeSpendChart.destroy();
      this._timeSpendChart = null;
    }
  }
}
