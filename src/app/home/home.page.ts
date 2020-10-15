import { IsnService } from './../services/isn.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';
import { Plugins, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { Report } from '../report/report';
import { NavController, Platform } from '@ionic/angular';
import { ReportDataService } from '../services/report-data.service';
import { User } from '../models/user';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fileContents: string;
  user: User;
  nearestOrders: any[];
  back: any;

  constructor(
    private intentData: IntentDataService,
    private reportData: ReportDataService,
    private navCtrl: NavController,
    private platform: Platform,
    public auth: AuthService,
    public isn: IsnService

  ) { }

  async ngOnInit() {
    this.back = this.platform.backButton.subscribeWithPriority(1, () => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
  });
    try {
      const fileURI = this.intentData.value.clipItems[0].uri;
      this.openFile(fileURI);
      this.nearestOrders = await this.isn.getNearestOrders();

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

  logout(){
    this.auth.logout();
    console.log(this.auth.loggedIn);

  }
  fileRead() {

    try {
      this.reportData.report = new Report(this.fileContents);
      // this.reportData.report.address = this.address;
      // this.reportData.report.inspector = this.inspector;
      // this.reportData.report.serial = this.serial;
      this.back.unsubscribe();
      this.navCtrl.navigateForward('report', {});
    } catch (error) {
      console.error(error);

    }
  }
}
