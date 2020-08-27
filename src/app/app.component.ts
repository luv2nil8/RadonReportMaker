import { Component } from '@angular/core';
declare var intentShim: any;
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { IntentDataService } from './services/intent-data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private intentData: IntentDataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => { 
      (<any>window).plugins.intentShim.getIntent(
        //success
        (intent) => { this.intentData.value = intent;},
        //error
        ()=>{ alert('Error getting intent'); }
      );
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
