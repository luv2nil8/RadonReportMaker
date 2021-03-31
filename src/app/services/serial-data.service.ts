import { Serial } from '@ionic-native/serial/ngx';
import { Injectable } from '@angular/core';
import { BehaviorSubject, observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SerialDataService {
  constructor(
    private serial: Serial
  ){}

  getPermission(): Promise<any>{
    return this.serial.requestPermission({
      //  Blue cord Id and Driver
      vid: '067b',
      pid: '2303',
      driver: 'ProlificSerialDriver'
    });
  }
  openPort(): Promise<any> {
    return this.serial.open({
      baudRate: 1200,
      dataBits: 8,
      stopBits: 1,
      parity: 0,
      dtr: false,
      rts: false,
      sleepOnPause: false
    });
  }
  readPort(): BehaviorSubject<number[]>{
    const streamBS: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
    try {
      this.getPermission();
      this.openPort();
      let stream = '';
      const floats = [];
      const read =  this.serial.registerReadCallback()
      // tslint:disable-next-line: deprecation
      .subscribe(
        (bytes) => {
          const flushStream = () => {
            stream.split(' ')
            .forEach((group, index) => {
              if (index === stream.length - 1) {
                stream = group;
                return;
              }
              if (/^\d+\.\d+/.test(group) && !(group === '')) {
                  floats.push(parseFloat(group));
                  stream = '';
                  streamBS.next(floats);
              }

              if (/(.+)?Overall/.test(group)) {
                streamBS.complete();
                read.unsubscribe();
                this.serial.close();
              }
            });
          };
          const buffer = bytes;
          const data = new Uint8Array(buffer);
          let cleaned = '';
          for (const chunk of data) {
            cleaned += String.fromCharCode(chunk);
          }
          if (cleaned.length) {
            stream += cleaned;
            flushStream();
          }
      });
    } catch (error) {
      console.error(error);
    }
    return streamBS;
  }

}
