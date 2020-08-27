import { Component } from '@angular/core';
import { IntentDataService } from '../services/intent-data.service';

import { Plugins, FilesystemDirectory, FilesystemEncoding } from '@capacitor/core';
const { Filesystem } = Plugins;
import { FileChooser } from '@ionic-native/file-chooser/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  intentContent: string;
  pageContent: string;
  inputPath: string;

  constructor( 
    private intentData: IntentDataService,
    private fileChooser: FileChooser
  ) {}

  ngOnInit(){
    try {
      this.intentContent = this.intentData.value.clipItems[0].uri;
      let filePath = "content://com.android.externalstorage.documents/document/primary%3ARadon%20FTLab/RadonEye%20Pro/"
      let fileName = this.intentContent.substr(this.intentContent.lastIndexOf("/")+1);
      this.intentContent = filePath+fileName;
      this.fileRead(filePath+fileName);
      
    } catch (error) {
      console.error("FileCHECK: "+error);
    }
  }

  openFile(){
    this.fileChooser.open({mime: "text/plain"})
    .then((uri) => {
      console.log(uri)
      this.inputPath = uri;
    })
    .catch(e => console.log(e));
  }
  getFile(){
    this.fileRead(this.inputPath)
  }


  async fileRead( fileName) {
    let contents = await Filesystem.readFile({
      path: fileName,
      encoding: FilesystemEncoding.UTF8
    });
    console.log(contents);
    this.pageContent = contents.data;
  }
}
