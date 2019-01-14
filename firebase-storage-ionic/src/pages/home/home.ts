import { Component } from '@angular/core';
import {ToastController} from 'ionic-angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import {Observable} from "rxjs";
import {DataProvider} from "../../providers/data/data";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: Observable<any[]>;

  constructor(private camera: Camera, //https://ionicframework.com/docs/native/camera/
              public toastCtrl: ToastController,
              private dataProvider: DataProvider) {

    this.images = this.dataProvider.getImages();
  }

  uploadImage(image) {
    let uploadTask = this.dataProvider.uploadToStorage(image);
    uploadTask.task.on('state_changed',
      (snapshot) => {},
      () => {},
    () => {}
    );

    uploadTask.then().then(res => {
      this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
        let toast = this.toastCtrl.create({
          message: 'New Image added!',
          duration: 3000
        });
        toast.present();
      });
    });
  }

  deleteImage(image) {
    this.dataProvider.deleteImage(image).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Image removed!',
        duration: 3000
      });
      toast.present();
    })
  }

  // SourceType: Set the source of the picture. Defined in Camera.PictureSourceType. Default is CAMERA. PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
  async takePicture(sourceType: PictureSourceType) {
    try {
      // defining camera options
      const options: CameraOptions = {
        quality: 70,
        destinationType: this.camera.DestinationType.DATA_URL, // DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible
        sourceType: sourceType,
        allowEdit: true, // Allow simple editing of image before selection. Cut image for example.
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 1280,
        targetHeight: 1280,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        saveToPhotoAlbum: true,
        cameraDirection: this.camera.Direction.BACK
      };

      const result = await this.camera.getPicture(options);
      alert(result);
      const image = `data:image/jpeg;base64,${result}`;

      this.uploadImage(image);

    } catch (e) {
      alert(e);
    }
  }
}
