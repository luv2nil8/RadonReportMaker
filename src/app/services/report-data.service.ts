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
    console.table(DS);
    DS[1] = `${parseInt(DS[1], 10) - 1}`; // convert month from zero index
    let date: Date = new (Date as any)(...DS);
    let stream = '';
    if (this.sameDay(date, new Date())){
      date = new Date(date.setDate(date.getDate() - 2));
    }
    let i = 1;

    for (const value of values){
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      stream += `${i++}) ${year}-${this.pad(month + 1)}-${this.pad(day)} ${this.pad(hour)}:${this.pad(minute)}:00, ${value.toFixed(1)}, 0, 0 \n`;
      date = new Date(date.setHours(date.getHours() + 1));
    }
    this.report = new Report(stream);
  }
  sameDay(d1, d2): boolean {
    return d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
  pad(digit: number){
    return (digit).toString().padStart(2, '0');
  }
}
