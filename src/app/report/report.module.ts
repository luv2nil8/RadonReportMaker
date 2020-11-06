import { UploaderModule } from './../components/uploader/uploader.module';
import { ReportModule } from './../components/report/report.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ReportPageRoutingModule } from './report-routing.module';

import { ReportPage } from './report.page';

@NgModule({
  imports: [
    CommonModule,
    ReportModule,
    UploaderModule,
    FormsModule,
    IonicModule,
    ReportPageRoutingModule
  ],
  declarations: [ReportPage]
})
export class ReportPageModule {}
