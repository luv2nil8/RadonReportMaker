import { UploaderComponent } from './uploader.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    UploaderComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    UploaderComponent
  ]
})
export class UploaderModule { }
