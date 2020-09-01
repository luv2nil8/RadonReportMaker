import { Component, OnInit } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';
import { Plugins, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Report } from '../report/report';
import { NavController } from '@ionic/angular';
import { ReportDataService } from '../services/report-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  testFileContents = 'FTLAB RADON DATA FILE MODEL NAME:,RadonEye Pro S/N:,RP22004010037 Calibrated:,03/31/2021 TYPE,Inspection Data Inspection Data Name,RP22004010037_15Jul20_1315 Date,07/15/2020 13:16 - 07/17/2020 13:40 Wi-Fi,On Display,On WaitTime,0 hour Inspection Duration,48 hour / 48 hour Event,10 Event 1 ,Vibration: 2020-7-15 14:10:28 Event 2 ,Vibration: 2020-7-15 14:10:38 Event 3 ,Vibration: 2020-7-15 14:11:27 Event 4 ,Vibration: 2020-7-15 14:12:3 Event 5 ,Vibration: 2020-7-15 14:12:7 Event 6 ,Vibration: 2020-7-15 14:14:40 Event 7 ,Vibration: 2020-7-15 14:15:4 Event 8 ,Vibration: 2020-7-15 14:15:18 Event 9 ,Vibration: 2020-7-15 14:15:23 Event 10 ,Vibration: 2020-7-15 14:22:8 Time step:,1hour Data No :,48 Radon concentration max =,0.38 Radon concentration min =,0.00 Overall Avg.=,0.12 EPA Protocol Avg.=,0.12 No,     Date time,      Radon(pCi/l), Temperature(°F), Humidity(%) 1), 2020-07-15 14:17:13,    0.14,          75,           27 2), 2020-07-15 15:17:13,    0.19,          75,           25 3), 2020-07-15 16:40:04,    0.00,          76,           24 4), 2020-07-15 17:40:04,    0.05,          74,           25 5), 2020-07-15 18:40:04,    0.05,          74,           26 6), 2020-07-15 19:40:04,    0.00,          74,           25 7), 2020-07-15 20:40:04,    0.00,          74,           26 8), 2020-07-15 21:40:04,    0.00,          73,           27 9), 2020-07-15 22:40:04,    0.14,          74,           26 10), 2020-07-15 23:40:04,    0.00,          74,           26 11), 2020-07-16 00:40:04,    0.19,          74,           25 12), 2020-07-16 01:40:04,    0.05,          74,           25 13), 2020-07-16 02:40:04,    0.19,          73,           25 14), 2020-07-16 03:40:04,    0.14,          73,           25 15), 2020-07-16 04:40:04,    0.22,          73,           25 16), 2020-07-16 05:40:04,    0.14,          73,           24 17), 2020-07-16 06:40:04,    0.22,          73,           24 18), 2020-07-16 07:40:04,    0.14,          73,           25 19), 2020-07-16 08:40:04,    0.22,          73,           25 20), 2020-07-16 09:40:04,    0.19,          74,           26 21), 2020-07-16 10:40:04,    0.14,          73,           28 22), 2020-07-16 11:40:04,    0.27,          73,           30 23), 2020-07-16 12:40:04,    0.05,          72,           31 24), 2020-07-16 13:40:04,    0.05,          71,           31 25), 2020-07-16 14:40:04,    0.19,          71,           31 26), 2020-07-16 15:40:04,    0.19,          71,           31 27), 2020-07-16 16:40:04,    0.05,          73,           30 28), 2020-07-16 17:40:04,    0.05,          73,           28 29), 2020-07-16 18:40:04,    0.05,          73,           28 30), 2020-07-16 19:40:04,    0.00,          73,           27 31), 2020-07-16 20:40:04,    0.05,          73,           27 32), 2020-07-16 21:40:04,    0.14,          73,           28 33), 2020-07-16 22:40:04,    0.19,          73,           28 34), 2020-07-16 23:40:04,    0.05,          73,           28 35), 2020-07-17 00:40:04,    0.14,          73,           28 36), 2020-07-17 01:40:04,    0.00,          74,           27 37), 2020-07-17 02:40:04,    0.05,          74,           27 38), 2020-07-17 03:40:04,    0.19,          74,           26 39), 2020-07-17 04:40:04,    0.14,          73,           26 40), 2020-07-17 05:40:04,    0.22,          73,           26 41), 2020-07-17 06:40:04,    0.38,          73,           26 42), 2020-07-17 07:40:04,    0.22,          73,           26 43), 2020-07-17 08:40:04,    0.30,          73,           26 44), 2020-07-17 09:40:04,    0.00,          74,           29 45), 2020-07-17 10:40:04,    0.14,          73,           33 46), 2020-07-17 11:40:04,    0.19,          71,           34 47), 2020-07-17 12:40:04,    0.05,          72,           32 48), 2020-07-17 13:40:04,    0.00,          72,           32 ';
  fileContents: string;
  inspector: string;
  address: string;
  serial: number;
  reportForm: FormGroup;

  constructor(
    private intentData: IntentDataService,
    private fileChooser: FileChooser,
    private reportData: ReportDataService,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private clipboard: Clipboard

  ) { }

  ngOnInit() {
    this.reportForm = this.formBuilder.group({
      inspector: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      serial: ['', [Validators.required]],
    });
    this.reportForm.controls.inspector.valueChanges.subscribe( val => this.inspector = val );
    this.reportForm.controls.serial.valueChanges.subscribe( val => this.serial = val );
    this.reportForm.controls.address.valueChanges.subscribe( val => this.address = val );

    try {
      const fileURI = this.intentData.value.clipItems[0].uri;
      this.openFile(fileURI);

    } catch (error) {
      this.fileContents = this.testFileContents;
      console.error('FileCHECK: ' + error);
    }
  }

  async openFile(fileURI) {
    const contents = await Filesystem.readFile({
      path: fileURI,
      encoding: FilesystemEncoding.UTF8
    });
    console.log(contents);
    this.fileContents = contents.data;
  }

  fileRead() {

    try {
      this.reportData.report = new Report(this.fileContents);
      this.reportData.report.address = this.address;
      this.reportData.report.inspector = this.inspector;
      this.reportData.report.serial = this.serial;
      this.navCtrl.navigateForward('report', {});
    } catch (error) {
      console.error(error);

    }
  }

  paste() {
    this.clipboard.paste().then(
      text => this.reportForm.controls.address.setValue(text)
    );
  }
}
