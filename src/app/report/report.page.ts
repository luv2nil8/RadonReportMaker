import { FileHandlerService } from './../services/file-handler.service';
import { AuthService } from './../services/auth.service';
import { Component, ViewChild, OnInit, ElementRef } from '@angular/core';
import { Report } from './report';
import { ReportDataService } from '../services/report-data.service';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { Chart } from 'chart.js';
import { Observable } from 'rxjs/Observable';


@Component({
  selector: 'app-report-page',
  templateUrl: './report.page.html',
  styleUrls: ['./report.page.scss'],
})

export class ReportPage implements OnInit {

  @ViewChild('radonCanvas') radonCanvas: ElementRef;

  radonChart: Chart;
  context: CanvasRenderingContext2D;
  socket: WebSocket;
  connected = false;
  sending = false;
  finished = false;
  pdf = false;
  report: Report;
  pdfObj: any;
  saveLocation: string;
  readings: any[] = [[{ colSpan: 12, text: 'Hourly Readings:' }, '', '', '', '', '', '', '', '', '', '', '']];
  graphData: number[] = [];
  messages: string[] = ['Making Pdf from Data.'];
  messagesObservable: Observable<string[]>;
  hidden = false;
  interval;


  constructor(
    private reportData: ReportDataService,
    private auth: AuthService,
    private fileHandler: FileHandlerService

  ) {

  }

  ngOnInit() {
    this.reconnect();
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
  reconnect(){
    this.interval = setInterval(() => {
      console.log('Trying Socket');
      if (!this.socket){
        this.socket = new WebSocket('ws://blipfiz.com:3000');
      }
      if (this.socket.readyState === 1 ){
        console.log('Connected!');
        this.connected = true;
        clearInterval(this.interval);
      }else if (this.socket.readyState === 0){
        console.log('Connecting');
      }else if (this.socket.readyState === 2){
        console.log('Closing');
      }else{
        console.log('Not Connected');
        delete this.socket;
      }
    }, 500);
  }
  getMessages(): Observable<string[]>{
    const observableMessage: Observable<string[]> = new Observable(observer => {
      observer.next(this.messages);
      this.socket.onmessage = (message) => {
        const packet = message.data;
        if ( packet instanceof Blob ) {
          try {
            this.fileHandler.savePDFBlob(this.saveLocation, packet );
            console.log('Pdf Saved to ' + this.saveLocation);
            observer.next(this.messages);
            this.pdf = true;
          }catch (error){
            this.messages.push(error);
            console.error(error);
          }
          this.closeSocket();

        } else {
          this.messages.push(packet);
          observer.next(this.messages);
        }
      };
      this.socket.onclose = () => {
         console.log('Socket Self Closed');
         this.closeSocket();
      };
    });
    return observableMessage;
  }
  closeSocket() {
    this.connected = false;
    this.finished = true;
    console.log('Closing Socket');
    this.socket.close();
    this.reconnect();
  }

  uploadReport(){
    this.sending = true;
    console.table( {
      key: this.auth.credentials.key,
      secret: this.auth.credentials.secret,
      report: this.report
    });
    let finalReport: any;
    this.report.oid = this.reportData.orderId;
    finalReport = this.report;
    finalReport.data = this.report.data.map(dataSlice => dataSlice.radon);
    this.socket.send( JSON.stringify({
      key: this.auth.credentials.key ,
      secret: this.auth.credentials.secret,
      report: this.report
    }));
  }
  exit(){
    // tslint:disable-next-line: no-string-literal
    navigator['app'].exitApp();
  }
  ionViewWillLeave() {
    clearInterval(this.interval);
    this.closeSocket();
  }
}
