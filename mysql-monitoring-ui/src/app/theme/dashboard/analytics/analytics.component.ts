import { Component, OnInit } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';

declare const AmCharts: any;

import '../../../../assets/charts/amchart/amcharts.js';
import '../../../../assets/charts/amchart/gauge.js';
import '../../../../assets/charts/amchart/pie.js';
import '../../../../assets/charts/amchart/serial.js';
import '../../../../assets/charts/amchart/light.js';
import '../../../../assets/charts/amchart/ammap.js';
import '../../../../assets/charts/amchart/worldLow.js';
import '../../../../assets/charts/amchart/continentsLow.js';
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: [
    './analytics.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss'
  ]
})
export class AnalyticsComponent implements OnInit {
  powerCardData: any;
  powerCardOption: any;

  waterCardData: any;
  waterCardOption: any;

  energyCardData: any;
  energyCardOption: any;

  public amountCardData: any;
  public amountCardOption: any;

  slowQueriesNumber: number;
  clientQueriesNumber: number;

  serverMemoryAllocated: number;

  schemaDiskSpace: string;
  schemaDiskSpaceData: {}[] = [];

  lastSelectQueries: string;
  lastSelectQueriesData: {}[] = [];

  lastInsertQueries: string;
  lastInsertQueriesData: {}[] = [];

  lastUpdateQueries: string;
  lastUpdateQueriesData: {}[] = [];

  lastDeleteQueries: string;
  lastDeleteQueriesData: {}[] = [];

  topSlowQueries: string;
  topSlowQueriesData: {}[] = [];




  //Websocket
  url = 'http://localhost:8080/mysql-monitoring-ws';
  client: any;

  constructor(private spinner: NgxSpinnerService) { }

  ngOnInit() {
    this.spinner.show();
    setTimeout(() => {
      /** spinner ends after 5 seconds */
      this.spinner.hide();
    }, 3000);
    this.connection();
    setTimeout(() => {
      AmCharts.makeChart('visitor-list-graph', {
        'type': 'serial',

        'theme': 'light',
        'dataDateFormat': 'YYYY-MM-DD',
        'precision': 2,
        'valueAxes': [{
          'id': 'v1',
          'title': 'Visitors',
          'position': 'left',
          'autoGridCount': false,
          'labelFunction': function(value) {
            return '$' + Math.round(value) + 'M';
          }
        }, {
          'id': 'v2',
          'title': 'New Visitors',
          'gridAlpha': 0,
          'position': 'right',
          'autoGridCount': false
        }],
        'graphs': [{
          'id': 'g3',
          'valueAxis': 'v1',
          'lineColor': '#a8d1ff',
          'fillColors': '#a8d1ff',
          'fillAlphas': 1,
          'type': 'column',
          'title': 'old Visitor',
          'valueField': 'sales2',
          'clustered': false,
          'columnWidth': 0.5,
          'legendValueText': '$[[value]]M',
          'balloonText': '[[title]]<br /><b style="font-size: 130%">$[[value]]M</b>'
        }, {
          'id': 'g4',
          'valueAxis': 'v1',
          'lineColor': '#4099ff',
          'fillColors': '#4099ff',
          'fillAlphas': 1,
          'type': 'column',
          'title': 'New visitor',
          'valueField': 'sales1',
          'clustered': false,
          'columnWidth': 0.3,
          'legendValueText': '$[[value]]M',
          'balloonText': '[[title]]<br /><b style="font-size: 130%">$[[value]]M</b>'
        }, {
          'id': 'g1',
          'valueAxis': 'v2',
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletColor': '#FFFFFF',
          'bulletSize': 5,
          'hideBulletsCount': 50,
          'lineThickness': 2,
          'lineColor': '#2ed8b6',
          'type': 'smoothedLine',
          'title': 'Last Month Visitor',
          'useLineColorForBulletBorder': true,
          'valueField': 'market1',
          'balloonText': '[[title]]<br /><b style="font-size: 130%">[[value]]</b>'
        }, {
          'id': 'g2',
          'valueAxis': 'v2',
          'bullet': 'round',
          'bulletBorderAlpha': 1,
          'bulletColor': '#FFFFFF',
          'bulletSize': 5,
          'hideBulletsCount': 50,
          'lineThickness': 2,
          'lineColor': '#FF5370',
          // 'type': 'smoothedLine',
          'dashLength': 5,
          'title': 'Average Visitor',
          'useLineColorForBulletBorder': true,
          'valueField': 'market2',
          'balloonText': '[[title]]<br /><b style="font-size: 130%">[[value]]</b>'
        }],
        'chartCursor': {
          'pan': true,
          'valueLineEnabled': true,
          'valueLineBalloonEnabled': true,
          'cursorAlpha': 0,
          'valueLineAlpha': 0.2
        },
        'categoryField': 'date',
        'categoryAxis': {
          'parseDates': true,
          'dashLength': 1,
          'minorGridEnabled': true
        },
        'legend': {
          'useGraphSettings': true,
          'position': 'top'
        },
        'balloon': {
          'borderThickness': 1,
          'cornerRadius': 5,
          'shadowAlpha': 0
        },
        'dataProvider': [{
          'date': '2013-01-16',
          'market1': 71,
          'market2': 75,
          'sales1': 5,
          'sales2': 8
        }, {
          'date': '2013-01-17',
          'market1': 74,
          'market2': 78,
          'sales1': 4,
          'sales2': 6
        }, {
          'date': '2013-01-18',
          'market1': 78,
          'market2': 88,
          'sales1': 5,
          'sales2': 2
        }, {
          'date': '2013-01-19',
          'market1': 85,
          'market2': 89,
          'sales1': 8,
          'sales2': 9
        }, {
          'date': '2013-01-20',
          'market1': 82,
          'market2': 89,
          'sales1': 9,
          'sales2': 6
        }, {
          'date': '2013-01-21',
          'market1': 83,
          'market2': 85,
          'sales1': 3,
          'sales2': 5
        }, {
          'date': '2013-01-22',
          'market1': 88,
          'market2': 92,
          'sales1': 5,
          'sales2': 7
        }, {
          'date': '2013-01-23',
          'market1': 85,
          'market2': 90,
          'sales1': 7,
          'sales2': 6
        }, {
          'date': '2013-01-24',
          'market1': 85,
          'market2': 91,
          'sales1': 9,
          'sales2': 5
        }, {
          'date': '2013-01-25',
          'market1': 80,
          'market2': 84,
          'sales1': 5,
          'sales2': 8
        }, {
          'date': '2013-01-26',
          'market1': 87,
          'market2': 92,
          'sales1': 4,
          'sales2': 8
        }, {
          'date': '2013-01-27',
          'market1': 84,
          'market2': 87,
          'sales1': 3,
          'sales2': 4
        }, {
          'date': '2013-01-28',
          'market1': 83,
          'market2': 88,
          'sales1': 5,
          'sales2': 7
        }, {
          'date': '2013-01-29',
          'market1': 84,
          'market2': 87,
          'sales1': 5,
          'sales2': 8
        }, {
          'date': '2013-01-30',
          'market1': 81,
          'market2': 85,
          'sales1': 4,
          'sales2': 7
        }]
      });

      /* power card chart start */
      this.powerCardData = gurubuildchartjs('#4099ff', [10, 25, 35, 20, 10, 20, 15, 45, 15, 10], null);
      this.powerCardOption = gurubuildchartoption();
      /* power card chart and */

      /* water card chart start */
      this.waterCardData = gurubuildchartjs('#FFB64D', [45, 25, 35, 20, 45, 20, 40, 10, 30, 45], null);
      this.waterCardOption = gurubuildchartoption();
      /* water card chart and */

      /* energy card chart start */
      this.energyCardData = gurubuildchartjs('#2ed8b6', [5, 35, 45, 20, 10, 30, 15, 45, 15, 10], null);
      this.energyCardOption = gurubuildchartoption();
      /* energy card chart and */

      /* amount card 1 to 4 start */
      this.amountCardData = j('#fff', [40, 30, 45, 30, 35], '#fff');
        this.amountCardOption = g();
      /* amount card 1 to 4 end */

    }, 75);
  }



  connection() {
    const ws = new SockJS (this.url);
    this.client = Stomp.over(ws);
    const that = this;

    this.client.connect({}, function(frame) {
      that.client.subscribe('/topicDBMS/processDBMS', (message) => {
        if (message.body) {
          let json = JSON.parse(message.body);
          that.schemaDiskSpace = json.schemaDiskSpace;
          that.slowQueriesNumber = json.slowQueriesNumber;
          that.lastSelectQueries = json.lastSelectQueries;
          that.lastInsertQueries = json.lastInsertQueries;
          that.lastUpdateQueries = json.lastUpdateQueries;
          that.lastDeleteQueries = json.lastDeleteQueries;
          that.topSlowQueries = json.topSlowQueries;
          that.clientQueriesNumber = json.clientQueriesNumber;
          that.serverMemoryAllocated = json.serverMemoryAllocated;

          for (let i = 0; i < json.schemaDiskSpace.length; i++) {
            that.schemaDiskSpaceData[i] = json.schemaDiskSpace[i];
          }

          for (let i = 0; i < json.lastSelectQueries.length; i++) {
            that.lastSelectQueriesData[i] = json.lastSelectQueries[i];
          }

          for (let i = 0; i < json.lastInsertQueries.length; i++) {
            that.lastInsertQueriesData[i] = json.lastInsertQueries[i];
          }

          for (let i = 0; i < json.lastUpdateQueries.length; i++) {
            that.lastUpdateQueriesData[i] = json.lastUpdateQueries[i];
          }

          for (let i = 0; i < json.lastDeleteQueries.length; i++) {
            that.lastDeleteQueriesData[i] = json.lastDeleteQueries[i];
          }

          for (let i = 0; i < json.topSlowQueries.length; i++) {
            that.topSlowQueriesData[i] = json.topSlowQueries[i];
          }
        }
      });
    });
  }

}

function gurubuildchartjs(a, b, f) {
  if (f == null) {
    f = 'rgba(0,0,0,0)';
  }
  return {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October'],
    datasets: [{
      label: '',
      borderColor: a,
      borderWidth: 2,
      hitRadius: 30,
      pointHoverRadius: 4,
      pointBorderWidth: 50,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: a,
      pointHoverBorderColor: 'transparent',
      fill: true,
      backgroundColor: f,
      data: b,
    }]
  };
}
function gurubuildchartoption() {
  return {
    title: {
      display: !1
    },
    tooltips: {
      enabled: true,
      intersect: !1,
      mode: 'nearest',
      xPadding: 10,
      yPadding: 10,
      caretPadding: 10
    },
    legend: {
      display: !1,
      labels: {
        usePointStyle: !1
      }
    },
    responsive: !0,
    maintainAspectRatio: !0,
    hover: {
      mode: 'index'
    },
    scales: {
      xAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Month'
        }
      }],
      yAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {
          display: !0,
          labelString: 'Value'
        },
        ticks: {
          beginAtZero: !0
        }
      }]
    },
    elements: {
      point: {
        radius: 4,
        borderWidth: 12
      }
    },
    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 5,
        bottom: 0
      }
    }
  };
}

function j(r, q, s) {
  if (s == null) {
    s = 'rgba(0,0,0,0)';
  }
  return {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [{
      label: '',
      borderColor: r,
      borderWidth: 2,
      hitRadius: 30,
      pointHoverRadius: 4,
      pointBorderWidth: 50,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointHoverBackgroundColor: r,
      pointHoverBorderColor: 'transparent',
      fill: true,
      backgroundColor: s,
      data: q,
    }]
  };
}




function g() {
  return {
    title: {display: !1},
    tooltips: {enabled: true, intersect: !1, mode: 'nearest', xPadding: 10, yPadding: 10, caretPadding: 10},
    legend: {display: !1, labels: {usePointStyle: !1}},
    responsive: !0,
    maintainAspectRatio: !0,
    hover: {mode: 'index'},
    scales: {
      xAxes: [{display: !1, gridLines: !1, scaleLabel: {display: !0, labelString: 'Month'}}],
      yAxes: [{
        display: !1,
        gridLines: !1,
        scaleLabel: {display: !0, labelString: 'Value'},
        ticks: {beginAtZero: !0}
      }]
    },
    elements: {point: {radius: 4, borderWidth: 12}},
    layout: {padding: {left: 0, right: 0, top: 0, bottom: 0}}
  };
}
