import { PopoverController } from '@ionic/angular';
import { ReportDataService } from 'src/app/services/report-data.service';
import { SerialDataService } from './../../../services/serial-data.service';
import { Component, Input, OnInit, NgZone } from '@angular/core';

@Component({
  selector: 'app-serial-waiting-popover',
  templateUrl: './serial-waiting-popover.component.html',
  styleUrls: ['./serial-waiting-popover.component.scss'],
})

export class SerialWaitingPopoverComponent implements OnInit {
  @Input() date: string;
  values: number[] = [];
  connected = false;
  progress;
  toggle = false;
  constructor(
    private serialData: SerialDataService,
    private reportData: ReportDataService,
    private popover: PopoverController,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.reconnect();
  }

  async reconnect(){
      try{
        await this.serialData.getPermission();
        await this.serialData.openPort();
        this.connected = true;
        this.readSerial();
      } catch (error){
        this.connected = false;

        const timeOut = setTimeout(() => {
          this.reconnect();
        }, 500);
        console.error(error);
      }
  }

  rawDataSpacer(): Array<null>{
    // create empty slots for data to sit nicely in UI, making sure that only 48 total slots are made
    const array = this.values.length >= 48 ? [] : Array(48 - this.values.length);
    console.log(array.length);
    return array;
  }
  formatString(data: number){
    return Number(data).toFixed(1);
  }
  readSerial(){
    this.serialData.readPort()
    // tslint:disable-next-line: deprecation
    .subscribe(
      (values: Array<number> ) => {
        this.values = values.slice(-48);
        if (this.values.length) {
          this.ngZone.runTask(() => {
            this.progress = this.values.length / 48;
          });
        }
      }, (error) => {console.error(error); },
      () => {
      this.reportData.convertSerialData(this.values, this.date);
      this.popover.dismiss();
    });
  }
  close(){
    delete this.reportData.report;
    this.popover.dismiss();
  }
}
