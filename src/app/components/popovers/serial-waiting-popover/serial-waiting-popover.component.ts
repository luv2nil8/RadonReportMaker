import { ReportDataService } from 'src/app/services/report-data.service';
import { SerialDataService } from './../../../services/serial-data.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-serial-waiting-popover',
  templateUrl: './serial-waiting-popover.component.html',
  styleUrls: ['./serial-waiting-popover.component.scss'],
})

export class SerialWaitingPopoverComponent implements OnInit {
  @Input() date: string;
  values: number[];
  constructor(
    private serialData: SerialDataService,
    private reportData: ReportDataService
  ) {
    this.serialData.readPort()
    // tslint:disable-next-line: deprecation
    .subscribe(
      (values) => {
        this.values = values;
      }, (error) => {console.error(error); },
      () => {
      this.reportData.convertSerialData(this.values, this.date);
    });
  }
  ngOnInit() {}

  rawDataSpacer(): Array<null>{
    return Array(48 - this.values.length);
  }
  formatString(data: number){
    return Number(data).toFixed(1);
  }
}
