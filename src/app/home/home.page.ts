import { DatabaseService } from './../services/database.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';
import { Plugins, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { Report } from '../report/report';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { ReportDataService } from '../services/report-data.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fileContents: string;
  nearestOrders: any[];
  back: any;
  orders: any;
  constructor(
    private intentData: IntentDataService,
    private reportData: ReportDataService,
    private navCtrl: NavController,
    private platform: Platform,
    public auth: AuthService,
    private database: DatabaseService

  ) {
   }

  async ngOnInit() {

    this.loadOrders();

    try {
      const fileURI = this.intentData.value.clipItems[0].uri;
      this.openFile(fileURI);


    } catch (error) {
      console.error('FileCHECK: ' + error);
    }

  }
  ionViewDidEnter() {
    this.back = this.platform.backButton.subscribeWithPriority(1, () => {
      // tslint:disable-next-line: no-string-literal
      navigator['app'].exitApp();
    });
  }

  loadOrders(event?){
    // console.log('Getting Orders');
    this.database.getNearestOrders().then(
      nearestOrders => {
        // console.log('Done: ');
        this.orders = nearestOrders;
        this.nearestOrders = this.orders;
        if (this.nearestOrders.length === 1 ) {
          // console.table(this.nearestOrders);
          this.fileRead(this.nearestOrders[0]);
        }
        try {
          event.target.complete();
        } catch (error) {
        }
      });
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
  searchCancel(){
    console.log('SearchCancel');
    this.nearestOrders = this.orders;

  }
  searchClear(){
    console.log('SearchClear');
  }
  async searchChange($event){
    console.log('SeachInput');
    console.table($event);
    const criteria = $event.detail.value;
    this.nearestOrders = await this.database.searchOrders(criteria);
  }

  doRefresh(event){
    this.loadOrders(event);
  }
  async fileRead(address) {

    try {
      this.reportData.report = new Report(this.fileContents);
      this.reportData.orderId = address.oid;
      this.reportData.report.address = `${address.address1} ${address.address2}, ${address.city}`;
      this.reportData.report.inspector = (await this.auth.getUser()).firstname;
      console.log('Report: ');
      console.table(this.reportData.report);
      this.back.unsubscribe();
      this.navCtrl.navigateForward('report', {});
    } catch (error) {
      console.error(error);

    }
  }
}
