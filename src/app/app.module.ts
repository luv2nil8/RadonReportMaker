import { SerialWaitingPopoverComponent } from './components/popovers/serial-waiting-popover/serial-waiting-popover.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, NavParams } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { File } from '@ionic-native/file/ngx';
import { Serial } from '@ionic-native/serial/ngx';



@NgModule({
  declarations: [
    AppComponent,
    SerialWaitingPopoverComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    AndroidPermissions,
    Geolocation,
    HTTP,
    File,
    NativeStorage,
    Serial,
    NavParams,
    Clipboard,
    ReactiveFormsModule,
    FormsModule,
    FileChooser,
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
