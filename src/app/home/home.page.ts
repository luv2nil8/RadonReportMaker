import { SerialWaitingPopoverComponent } from './../components/popovers/serial-waiting-popover/serial-waiting-popover.component';
import { DatabaseService } from './../services/database.service';
import { AuthService } from './../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';
import { Plugins, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { Report } from '../report/report';
import { NavController, Platform, PopoverController } from '@ionic/angular';
import { ReportDataService } from '../services/report-data.service';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  fileContents = '';
  nearestOrders: any[];
  back: any;
  orders: any;
  constructor(
    private intentData: IntentDataService,
    private reportData: ReportDataService,
    private navCtrl: NavController,
    private platform: Platform,
    public auth: AuthService,
    private database: DatabaseService,
    private popover: PopoverController

  ) {
   }

  async ngOnInit() {

    this.loadOrders();

    try {
      const fileURI = this.intentData.value.clipItems[0].uri;
      if (fileURI) {
        this.openFile(fileURI);
      }


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
    this.database.getNearestOrders().then(
      nearestOrders => {
        this.orders = nearestOrders;
        this.nearestOrders = this.orders;
        if (this.nearestOrders.length === 1 ) {
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

  }
  searchCancel(){

    this.nearestOrders = this.orders;
  }

  searchClear(){

    this.nearestOrders = this.orders;
  }

  async searchChange($event){
    console.table($event);
    const criteria = $event.detail.value;
    if (criteria.length === 0 ) { this.searchCancel(); }
    if (criteria.length >= 3){
      delete this.nearestOrders;
      this.nearestOrders = await this.database.searchOrders(criteria);
    }
  }

  doRefresh(event){
    this.loadOrders(event);
  }

  async fileRead(address) {
    try {
      if (this.fileContents === '') {
        const popover = await this.popover.create({
          component: SerialWaitingPopoverComponent,
          backdropDismiss: false,
          componentProps: {
            date: address.datetime
          },
          cssClass: 'serial-waiting-popover'
        });
        popover.present();
        popover.onDidDismiss().then( async () => {
          this.setReportDataAndNav(address);
        });

      } else {
        this.reportData.report = new Report(this.fileContents);
        this.setReportDataAndNav(address);
      }

    } catch (error) {
      console.error(error);

    }
  }
  async setReportDataAndNav(address){
    this.reportData.orderId = address.oid;
    this.reportData.report.UUID = address.id;
    this.reportData.report.oid = address.oid;
    this.reportData.report.address = `${address.address1} ${address.address2}, ${address.city}`;
    this.reportData.report.inspector = (await this.auth.getUser()).firstname;
    console.table(this.reportData.report);
    this.back.unsubscribe();
    this.navCtrl.navigateForward('report', {});
  }

}
