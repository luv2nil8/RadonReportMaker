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
  convertSerialData(values: number[], dateString: string){
    const DS = dateString.split(/-|\:|\s/);
    console.log('DS: ');
    console.table(DS);
    DS[1] = `${parseInt(DS[1], 10) - 1}`; // convert month from zero index
    let date: Date = new (Date as any)(...DS);
    let stream = '';
    if (this.sameDay(date, new Date())){
      console.log('Within the day');
      date = new Date(date.setDate(date.getDate() - 2));
    }
    let i = 1;
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    for (const value of values){
      console.log(`${i++}) ${year}-${month}-${day} ${hour}:${minute}:00, ${value}, 0, 0 \n`);
      stream += `${i++}) ${year}-${month}-${day} ${hour}:${minute}:00, ${value}, 0, 0 \n`;
    }
    this.report = new Report(stream);
  }
  sameDay(d1, d2): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
}
