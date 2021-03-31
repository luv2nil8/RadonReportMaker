import { Injectable } from '@angular/core';
import { File} from '@ionic-native/file/ngx';
import { AndroidPermissionResponse, AndroidPermissions } from '@ionic-native/android-permissions/ngx';


@Injectable({
  providedIn: 'root'
})
export class FileHandlerService {

  constructor(
    private file: File,
    private androidPermissions: AndroidPermissions,

  ) { }
  async getPermission(permission: AndroidPermissionResponse){
    console.log('Has permission?', permission.hasPermission);
    if (permission.hasPermission){
      console.log('Has permission');
    }else {
      await this.androidPermissions.requestPermission( this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    }
  }
  async savePDFBlob( fileName: string, blob: Blob) {
    const permission = await this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
    await this.getPermission(permission);
    const result = this.file.writeFile(this.file.externalRootDirectory + '/Download', fileName, blob, { replace: true });
    result.catch((err) => { throw new Error('Error saving file: ' + err); });


  }
}
