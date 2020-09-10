import { Component, OnInit } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';
import { Plugins, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { Report } from '../report/report';
import { NavController, Platform } from '@ionic/angular';
import { ReportDataService } from '../services/report-data.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fileContents: string;
  inspector: string;
  address: string;
  serial: number;
  reportForm: FormGroup;
  back: any;

  constructor(
    private intentData: IntentDataService,
    private reportData: ReportDataService,
    private navCtrl: NavController,
    public formBuilder: FormBuilder,
    private clipboard: Clipboard,
    private platform: Platform

  ) { }

  ngOnInit() {
    this.back = this.platform.backButton.subscribeWithPriority(1, () => {
      navigator['app'].exitApp();
  });
    this.reportForm = this.formBuilder.group({
      inspector: ['', [Validators.required, Validators.minLength(2)]],
      address: ['', [Validators.required]],
      serial: ['', [Validators.required]],
    });
    this.reportForm.controls.inspector.valueChanges.subscribe( val => this.inspector = this.toTitleCase(val.trim()) );
    this.reportForm.controls.serial.valueChanges.subscribe( val => this.serial = val );
    this.reportForm.controls.address.valueChanges.subscribe( val => this.address = this.toTitleCase(val.trim()) );

    try {
      const fileURI = this.intentData.value.clipItems[0].uri;
      this.openFile(fileURI);

    } catch (error) {
      console.error('FileCHECK: ' + error);
    }
  }

  async openFile(fileURI) {
    const contents = await Filesystem.readFile({
      path: fileURI,
      encoding: FilesystemEncoding.UTF8
    });
    this.fileContents = contents.data;
  }

  fileRead() {

    try {
      this.reportData.report = new Report(this.fileContents);
      this.reportData.report.address = this.address;
      this.reportData.report.inspector = this.inspector;
      this.reportData.report.serial = this.serial;
      this.back.unsubscribe();
      this.navCtrl.navigateForward('report', {});
    } catch (error) {
      console.error(error);

    }
  }

  paste() {
    this.clipboard.paste().then(
      text => {
        this.reportForm.controls.address.setValue(text);
      }
    );
    this.reportForm.controls.address.markAsDirty();

  }
   toTitleCase(str) {
    str = str.toLowerCase().split(' ');
    for (let i = 0; i < str.length; i++) {
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
    return str.join(' ');
  }
}
