import { AuthService } from './../services/auth.service';
import { EnvService } from './../services/env.service';
import { HTTP } from '@ionic-native/http/ngx';
import { Platform } from '@ionic/angular';
import { Component, ViewChild, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { Report } from './report';
import { ReportDataService } from '../services/report-data.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Plugins, FilesystemDirectory } from '@capacitor/core';
const { Filesystem } = Plugins;
import { Chart } from 'chart.js';


@Component({
  selector: 'app-report-page',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})

export class ReportPage implements OnInit {

  @ViewChild('radonCanvas') radonCanvas: ElementRef;

  radonChart: Chart;
  context: CanvasRenderingContext2D;

  sending = false;
  response = '';
  report: Report;
  pdfObj: any;
  saveLocation: string;
  readings: any[] = [[{ colSpan: 12, text: 'Hourly Readings:' }, '', '', '', '', '', '', '', '', '', '', '']];
  graphData: number[] = [];
  constructor(
    private reportData: ReportDataService,
    private http: HTTP,
    private auth: AuthService

  ) { }

  ngOnInit() {
    this.report = this.reportData.report;
    console.table(this.report.data);
    this.saveLocation = this.report.address.trim().replace(/\s|,|-|\.|\/|\\,/g, '_').replace(/\_+/g, '_') + '.pdf';
    const graphData = [];
    for (let i = 0; i < 4; i++) {
      const row = [];
      for (let j = 0; j < 12; j++) {
        if (this.report.data[(i * j) + j]) {
          row.push({ text: this.report.data[(i * j) + j].radon.toFixed(2).toString(), alignment: 'center', fontSize: 10 });
          graphData.push(this.report.data[(i * j) + j].radon);
        }
        else { this.readings.push(''); }
      }
      this.readings.push(row);
      this.graphData = graphData;
    }
  }

  doTheThing(){
    this.sending = true;
    console.table( {
      key: this.auth.credentials.key,
      secret: this.auth.credentials.secret,
      oid: this.reportData.orderId,
      report: this.report
    });
    let finalReport: any;
    finalReport = this.report;
    finalReport.data = this.report.data.map(dataSlice => dataSlice.radon);

    this.http.setDataSerializer('json');
    this.http.post('https://blipfiz.com/api/uploadtoisn',
      {
        key: this.auth.credentials.key ,
        secret: this.auth.credentials.secret,
        oid: this.reportData.orderId,
        report: this.report
      },
      {}
    ).then((res) => {
      if (JSON.parse(res.data).success) {
        this.response = 'Report Uploaded, Emails Sent!';
      } else {
        this.response = 'Error: ' + JSON.parse(res.data).response;
      }
    });
  }
  exit(){
    // tslint:disable-next-line: no-string-literal
    navigator['app'].exitApp();
  }
}
