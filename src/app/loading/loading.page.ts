import { NavController } from '@ionic/angular';
import { AfterViewInit, Component } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.page.html',
  styleUrls: ['./loading.page.scss'],
})
export class LoadingPage implements AfterViewInit {

  constructor(
    private navCtrl: NavController
  ) { }

  ngAfterViewInit() {
    this.navCtrl.navigateRoot('home', {});
  }
}
