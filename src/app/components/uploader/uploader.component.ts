import { Observable } from 'rxjs/Observable';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss'],
})
export class UploaderComponent {
  messageArray: string[];
  @Input()
  set messages(val: Observable<string[]>) {
    val.subscribe((message) => {
      this.messageArray = message;
    });
  }

  constructor() { }
  animateMessage(index){
    if (index === (this.messageArray.length - 1) ){
      // check if the index is the last, if not, set animation to fade out.
      return 'fadeIn';
    }else {
      return 'fadeOut';
    }
  }
}
