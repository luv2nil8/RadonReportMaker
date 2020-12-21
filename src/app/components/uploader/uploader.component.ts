import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent implements AfterViewInit {
  item = 0;

  constructor() { }

  ngAfterViewInit(){
    const timer = setInterval(() => {
      //console.log('Second: ' + this.item);
      this.item++;
      if (this.item === 9){
        clearInterval(timer);
      }
    }, 2000);
  }

}
