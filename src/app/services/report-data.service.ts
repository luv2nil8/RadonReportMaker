import { Injectable } from '@angular/core';
import { Report } from '../report/report';

@Injectable({
  providedIn: 'root'
})
export class ReportDataService {
  report: Report;
  orderId: number;
  constructor() {
  }
}
