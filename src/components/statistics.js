import AbstractSmartComponent from "./abstract-smart-component.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {TRANSPORTS, formatDays} from "./../utils/common.js";

// Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
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

const getActiveTypes = (tripEvents) => {
  return tripEvents
    .map((tripEvent) => tripEvent.type)
    .filter(getUniqItems);
};

const addEmoji = (eventTypes) => {
  return eventTypes.slice().map((string) => {
    return `${typeToEmoji[string]} ${string.toUpperCase()}`;
  });
};

const calcUniqCountForTransport = (tripEvents, transportType) => {
  return tripEvents.filter((it) => it.type === transportType).length;
};

const getTotalPriceForType = (tripEvents, eventType) => {
  return tripEvents
  .filter((it) => it.type === eventType)
  .map((tripEvent) => tripEvent.price)
  .reduce((a, b) => a + b);
};

const getTotalTimeForType = (tripEvents, eventType) => {
  return tripEvents
  .filter((it) => it.type === eventType)
  .map((tripEvent) => tripEvent.finish - tripEvent.start)
  .reduce((a, b) => a + b);
};

const sortMoneyBars = (eventTypes, tripEvents) => {
  return eventTypes
  .map((eventType) => {
    return {
      type: eventType,
      total: getTotalPriceForType(tripEvents, eventType),
    };
  })
  .sort((a, b) => b.total - a.total);
};

const sortTransportBars = (transportTypes, tripEvents) => {
  return transportTypes
  .map((transportType) => {
    return {
      type: transportType,
      count: calcUniqCountForTransport(tripEvents, transportType),
    };
  })
  .sort((a, b) => b.count - a.count);
};

const sortTimeBars = (eventTypes, tripEvents) => {
  return eventTypes
  .map((eventType) => {
    return {
      type: eventType,
      time: getTotalTimeForType(tripEvents, eventType),
    };
  })
  .sort((a, b) => b.time - a.time);
};

const renderMoneyChart = (moneyCtx, tripEvents) => {
  const eventTypes = getActiveTypes(tripEvents);
  moneyCtx.height = BAR_HEIGHT * eventTypes.length;

  const sortedData = sortMoneyBars(eventTypes, tripEvents);

  const labels = sortedData.map((data) => data.type);
  const emojiLables = addEmoji(labels);

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedData.map((data) => data.total),
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

const renderTransportChart = (transportCtx, tripEvents) => {
  const transportEvents = tripEvents
    .filter((it) => TRANSPORTS.indexOf(it.type) !== -1);

  const transportTypes = getActiveTypes(transportEvents);
  transportCtx.height = BAR_HEIGHT * transportTypes.length;

  const sortedData = sortTransportBars(transportTypes, tripEvents);

  const labels = sortedData.map((data) => data.type);
  const emojiLables = addEmoji(labels);

  return new Chart(transportCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedData.map((data) => data.count),
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

const renderTimeSpendChart = (timeSpendCtx, tripEvents) => {
  const eventTypes = getActiveTypes(tripEvents);
  timeSpendCtx.height = BAR_HEIGHT * eventTypes.length;

  const sortedData = sortTimeBars(eventTypes, tripEvents);

  const labels = sortedData.map((data) => data.type);
  const emojiLables = addEmoji(labels);

  return new Chart(timeSpendCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: emojiLables,
      datasets: [{
        data: sortedData.map((data) => data.time),
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

  recoveryListeners() {}

  rerender(pointsModel) {
    this._pointsModel = pointsModel;
    super.rerender();

    this._renderCharts();
  }

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
