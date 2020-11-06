import { ReportComponent } from './report.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';


@NgModule({
  declarations: [
    ReportComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    ReportComponent
  ]
})
export class ReportModule { }
