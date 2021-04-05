import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';
import { ReportDataService } from 'src/app/services/report-data.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss'],
})
export class ReportComponent implements AfterViewInit {

@ViewChild('radonCanvas') radonCanvas: ElementRef;

  radonChart: Chart;
  context: CanvasRenderingContext2D;

  address: string;
  startTimeString: string;
  endTimeString: string;
  inspector: string;
  serial: number;
  data: number[];
  resultString: string;
  average: number;
  EPAaverage: number;
  passFail: string;

  constructor(
    private radon: ReportDataService
  ) {
    this.address = this.radon.report.address;
    let date = this.radon.report.startTime;
    this.startTimeString = `${String(date.getMonth() + 1).padStart(2, '0')}\/${String(date.getDate()).padStart(2, '0')}\/${date.getFullYear()}  ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    date = this.radon.report.endTime;
    this.endTimeString = `${String(date.getMonth() + 1).padStart(2, '0')}\/${String(date.getDate()).padStart(2, '0')}\/${date.getFullYear()}  ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    this.inspector = this.radon.report.inspector;
    this.serial = this.radon.report.serial;
    this.data = this.radon.report.data.map(slice => slice.radon);
    if (this.radon.report.result) { this.resultString = ' Results were below 4.0 pCi/l, and appear to be safe.'; }
    else { this.resultString = 'With the results being above 4.0 pCi/l, we recommend to have a Radon Mitigation Contractor out to advise you on installation of a mitigation system.'; }
    this.average = this.radon.report.average;
    this.EPAaverage = this.radon.report.EPAaverage;
    this.data.unshift(this.average);
    this.passFail = this.radon.report.result ? 'Result: Pass' : 'Result: Fail';
  }
  ngAfterViewInit() {
    this.context = (this.radonCanvas.nativeElement as HTMLCanvasElement).getContext('2d');
    this.radonChart = new Chart(this.radonCanvas.nativeElement, this.generateConfig());
    this.radonChart.config = this.generateConfig();
  }

  formatData(dataSet) {
    const XYCoords = [];
    for (let i = 0; dataSet.length > i; i++) {
      XYCoords.push({ x: i, y: dataSet[i] });
    }
    return XYCoords;
  }

  createPinstripeCanvas(color) {
    const ctx = this.context;
    const p = document.createElement('canvas');
    p.width = 16;
    p.height = 16;
    const pctx = p.getContext('2d');

    const x0 = 0;
    const x1 = 18;
    const y0 = 17;
    const y1 = -1;
    const offset = 8;

    pctx.strokeStyle = color;
    pctx.lineWidth = 1;
    pctx.beginPath();
    pctx.moveTo(x0, y0);
    pctx.lineTo(x1, y1);
    pctx.moveTo(x0 - offset, y0);
    pctx.lineTo(x1 - offset, y1);
    pctx.moveTo(x0 + offset, y0);
    pctx.lineTo(x1 + offset, y1);
    pctx.moveTo(x0 - offset * 2, y0);
    pctx.lineTo(x1 - offset * 2, y1);
    pctx.stroke();
    return ctx.createPattern(p, 'repeat');
  }

  generateConfig(): Chart.ChartConfiguration {
    return {
      type: 'line',

      data: {
        datasets: [{
          label: 'Max',
          data: Array.from({ length: this.data.length + 1 }, (v, i) => 4)
          ,
          backgroundColor: 'rgba(0,0,0,0)',
          borderColor: this.average >= 4.0 ? '#FF0000' : '#00ff00',
          borderWidth: 3,
          radius: 0

        }, {
          label: 'pCi/l',
          data: this.formatData(this.data),
          backgroundColor: 'rgba(43,49,69, 0.25 )',
          borderColor: '#2b3145',
          borderWidth: 3,
          radius: 2


        }, {

          label: 'Average',
          data: Array.from({ length: this.data.length + 1 }, (v, i) => this.average)
          ,
          backgroundColor: this.createPinstripeCanvas('#FF6600'),
          borderColor: '#FF6600',
          borderWidth: 1.5,
          radius: 0



        }],
        labels: Array.from({ length: 49 }, (v, i) => i.toString())

      },
      options: {
        animation: {
          duration: 0 // general animation time
        },
        aspectRatio: 1,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 16
          }
        },

        scales: {
          xAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Hours Past'
            },
            ticks: {
              min: 0,
              maxTicksLimit: 11,
              stepSize: 4
            }
          }],
          yAxes: [{
            scaleLabel: {
              display: true,
              labelString: 'Radon in pCi/l'
            },
            ticks: {
              min: 0,
            },
            stacked: false
          }]
        }
      }
    };
  }

}
