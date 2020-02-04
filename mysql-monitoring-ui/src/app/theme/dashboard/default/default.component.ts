import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {animate, style, transition, trigger} from '@angular/animations';
import * as c3 from 'c3';

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

import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: [
    './default.component.scss',
    '../../../../assets/icon/icofont/css/icofont.scss',
    '../../../../../node_modules/c3/c3.min.css',
    '../../../../assets/charts/radial/css/radial.scss'
  ],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fadeInOutTranslate', [
      transition(':enter', [
        style({opacity: 0}),
        animate('400ms ease-in-out', style({opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translate(0)'}),
        animate('400ms ease-in-out', style({opacity: 0}))
      ])
    ])
  ]
})
export class DefaultComponent implements OnInit, AfterViewInit {
  public seoCard1Data: any;
  public seoCard2Data: any;
  public seoCard1Option: any;
  public seoCard2Option: any;
  @ViewChild('seoCard1Chart') seoCard1Chart: ElementRef;
  @ViewChild('seoCard2Chart') seoCard2Chart: ElementRef;
  public seoCard1Tag: CanvasRenderingContext2D;
  public seoCard2Tag: CanvasRenderingContext2D;

  public feedbackData: any;
  public feedbackOption: any;

  dataSentCount:number = 1;

  public chartTraffic;

  //AllDatas
  maxRamSize: number;
  serverUptime: string;
  serverMemoryAllocated: number;
  serverCpuLoad: number;
  threadsConnected: number;
  threadsRunning: number;
  diskSize: number;
  diskFreeSpace: number;
  data_sent = ['Sent'];
  data_received = ['Received'];

  //Websocket
  url = 'http://localhost:8080/mysql-monitoring-ws'
  client: any;

    options: any = {
      position: ['bottom', 'right'],
    };

    constructor(private spinner: NgxSpinnerService) {
    }

  ngOnInit() {
    this.connection();

    this.spinner.show();
 
    setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
    }, 3000);

    //CPU

    //Data Traffic
      this.chartTraffic = c3.generate({
      bindto: '#chart-traffic',
      data: {
        columns: [
          this.data_sent,
          this.data_received
        ],
        types: {
          Sent: 'area-spline',
          Received: 'area-spline'
          // 'line', 'spline', 'step', 'area', 'area-step' are also available to stack
        },
        colors: {
          Sent: 'rgba(61, 186, 95, 0.99)',
          Received: 'rgba(204, 144, 47, 0.99)'
        },
        groups: [
          ['Sent', 'Received']
        ]
      }
    });
  }

  callChart(){
      //Chart for RAM Allocation
    const chartRam = c3.generate({
      bindto: '#chart-ram',
      data: {
        columns: [
          ['MySQL Usage (' + (this.serverMemoryAllocated) + " MB)", this.serverMemoryAllocated],
          ['Capacity (' + (this.maxRamSize) + " MB)", this.maxRamSize-this.serverMemoryAllocated],
        ],
        type: 'donut',
        onclick: function (d, i) {
          console.log('onclick', d, i);
        },
        onmouseover: function (d, i) {
          console.log('onmouseover', d, i);
        },
        onmouseout: function (d, i) {
          console.log('onmouseout', d, i);
        }
      },
      color: {
        pattern: ['#4C5667', '#1ABC9C']
      },
      donut: {
        title: 'RAM Allocation'
      }
    });


    //Chart for CPU
    const chartCpu = c3.generate({
      bindto: '#chart-cpu',
      data: {
        columns: [
          ['CPU Load', this.serverCpuLoad],
          ['CPU Capacity', 100-this.serverCpuLoad],
        ],
        type: 'donut',
        onclick: function (d, i) {
          console.log('onclick', d, i);
        },
        onmouseover: function (d, i) {
          console.log('onmouseover', d, i);
        },
        onmouseout: function (d, i) {
          console.log('onmouseout', d, i);
        }
      },
      color: {
        pattern: ['#4C5667', '#4099ff']
      },
      donut: {
        title: 'CPU Usage'
      }
    });

    //Chart for Disk
    const chartDisk = c3.generate({
      bindto: '#chart-disk',
      data: {
        columns: [
          ['Used (' + (this.diskSize - this.diskFreeSpace) + " GB)", this.diskSize - this.diskFreeSpace],
          ['Capacity (' + this.diskSize + " GB)", this.diskSize],
        ],
        type: 'donut',
        onclick: function (d, i) {
          console.log('onclick', d, i);
        },
        onmouseover: function (d, i) {
          console.log('onmouseover', d, i);
        },
        onmouseout: function (d, i) {
          console.log('onmouseout', d, i);
        }
      },
      color: {
        pattern: ['#4C5667', '#ffcb80']
      },
      donut: {
        title: 'DISK Usage'
      }
    });



  }


  connection(){
    let ws = new SockJS (this.url);
    this.client = Stomp.over(ws);
    let that = this;

    this.client.connect({}, function(frame) {
      that.client.subscribe('/topic/process', (message) => {

        if(message.body) {
          let json = JSON.parse(message.body);

          that.maxRamSize = json.maxRamSize;
          that.serverUptime = json.serverUptime;
          that.serverMemoryAllocated = json.serverMemoryAllocated;
          that.serverCpuLoad = json.serverCpuLoad;
          that.threadsConnected = json.threadsConnected;
          that.threadsRunning = json.threadsRunning;
          that.diskSize = json.diskSize;
          that.diskFreeSpace = json.diskFreeSpace;

          if(that.dataSentCount > 0){
            that.data_sent[that.dataSentCount] = json.bytesSent;
            that.data_received[that.dataSentCount] = json.bytesReceived;
            if (that.dataSentCount >= 20){
              that.data_sent.splice(1, 1);
              that.data_received.splice(1, 1);
              that.dataSentCount--;
            }
            that.dataSentCount++;

          }

          that.chartTraffic.load({
            columns: [
              that.data_sent,
              that.data_received,
            ]
          });

          that.callChart();

        }
      });
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {

      AmCharts.makeChart( 'statistics_chart', {
        'type': 'serial',
        'theme': 'light',
        'dataDateFormat': 'YYYY-MM-DD',
        'precision': 2,
        'valueAxes': [{
          'id': 'v1',
          'title': 'Sales',
          'position': 'left',
          'autoGridCount': false,
          'labelFunction': function(value) {
            return '$' + Math.round(value) + 'M';
          }
        }, {
          'id': 'v2',
          'gridAlpha': 0.1,
          'autoGridCount': false
        }],
        'graphs': [{
          'id': 'g1',
          'valueAxis': 'v2',
          'lineThickness': 0,
          'fillAlphas': 0.2,
          'lineColor': '#4099ff',
          'type': 'line',
          'title': 'Laptop',
          'useLineColorForBulletBorder': true,
          'valueField': 'market1',
          'balloonText': '[[title]]<br /><b style="font-size: 130%">[[value]]</b>'
        }, {
          'id': 'g2',
          'valueAxis': 'v2',
          'fillAlphas': 0.6,
          'lineThickness': 0,
          'lineColor': '#4099ff',
          'type': 'line',
          'title': 'TV',
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
          'gridAlpha' : 0,
          'minorGridEnabled': true
        },
        'legend': {
          'position': 'top',
        },
        'balloon': {
          'borderThickness': 1,
          'shadowAlpha': 0
        },
        'export': {
          'enabled': true
        },
        'dataProvider': [{
          'date': '2013-01-01',
          'market1': 0,
          'market2': 0,
          'sales1': 0
        }, {
          'date': '2013-02-01',
          'market1': 130,
          'market2': 110,
          'sales1': 0
        }, {
          'date': '2013-03-01',
          'market1': 80,
          'market2': 60,
          'sales1': 0
        }, {
          'date': '2013-04-01',
          'market1': 70,
          'market2': 200,
          'sales1': 0
        }, {
          'date': '2013-05-01',
          'market1': 180,
          'market2': 150,
          'sales1': 0
        }, {
          'date': '2013-06-01',
          'market1': 105,
          'market2': 90,
          'sales1': 0
        }, {
          'date': '2013-07-01',
          'market1': 250,
          'market2': 150,
          'sales1': 0
        }]
      });

      /* feedback chart start */
      this.feedbackData = {
        datasets: [{
          data: [83, 17],
          backgroundColor: ['#4099ff', '#81c1fd'],
          label: 'Dataset 1',
          borderWidth: 0
        }], labels: ['Positive', 'Negative']
      };

      this.feedbackOption = {
        responsive: true,
        legend: {display: false},
        title: {display: false, text: 'Chart.js Doughnut Chart'},
        animation: {animateScale: true, animateRotate: true}
      };
      /* feedback chart end */

      /* seo card start */
      const seo1_tag = (((<HTMLCanvasElement>this.seoCard1Chart.nativeElement).children));
      this.seoCard1Tag = ((seo1_tag['seo-card1']).lastChild).getContext('2d');
      const d = (this.seoCard1Tag).createLinearGradient(300, 0, 0, 300);
      d.addColorStop(0, '#b9fdef');
      d.addColorStop(1, '#2ed8b6');

      const seo2_tag = (((<HTMLCanvasElement>this.seoCard2Chart.nativeElement).children));
      this.seoCard2Tag = ((seo2_tag['seo-card2']).lastChild).getContext('2d');
      const x = (this.seoCard2Tag).createLinearGradient(300, 0, 0, 300);
      x.addColorStop(0, '#b5d8ff');
      x.addColorStop(1, '#4099ff');

      this.seoCard1Data = e('#2ed8b6', [100, 80, 100, 150, 190, 200, 160], d);
      this.seoCard1Option = f();

      this.seoCard2Data = e('#4099ff', [100, 80, 100, 150, 190, 200, 160], x);
      this.seoCard2Option = f();
      /* seo card end */
    }, 75);
  }

}

function e(h, g, i) {
  if (i == null) {
    i = 'rgba(0,0,0,0)';
  }
  return {
    labels: ['1', '2', '3', '4', '5', '6', '7'],
    datasets: [{
      label: '',
      borderColor: h,
      borderWidth: 2,
      hitRadius: 0,
      pointHoverRadius: 0,
      pointRadius: 3,
      pointBorderWidth: 2,
      pointHoverBorderWidth: 12,
      pointBackgroundColor: '#fff',
      pointBorderColor: h,
      pointHoverBackgroundColor: h,
      pointHoverBorderColor: '#000',
      fill: true,
      backgroundColor: i,
      data: g,
    }]
  };
}

function f() {
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
