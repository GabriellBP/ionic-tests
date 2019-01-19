import { Component } from '@angular/core';
import {ToastController} from 'ionic-angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import {Observable} from "rxjs";
import {DataProvider} from "../../providers/data/data";
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  images: Observable<any[]>;
  downloadURL: Observable<string>;
  uploadPercent: Observable<number>;

  constructor(private camera: Camera, //https://ionicframework.com/docs/native/camera/
              public toastCtrl: ToastController,
              private dataProvider: DataProvider) {

    this.images = this.dataProvider.getImages();
  }

  uploadImage(image) {
    const dateNow = new Date().getTime();
    let newName = `images/${dateNow}.jpeg`;
    const upload = this.dataProvider.uploadToStorage(image, newName);
    let ref = upload[0];
    let task = upload[1];

    // @ts-ignore
    this.uploadPercent = task.percentageChanges();

    // @ts-ignore
    task.snapshotChanges().pipe(
      finalize(() => {
        // @ts-ignore
        this.downloadURL = ref.getDownloadURL();
        this.downloadURL.subscribe(url=> {
          let toSave = {
                created: dateNow,
                url: url,
                fullPath: newName
              };
              let store = this.dataProvider.storeInfoToDatabase(toSave);
              store.then(() => {
                let toast = this.toastCtrl.create({
                  message: 'New Image added!',
                  duration: 3000
                });
                toast.present();
              }, () => alert('error'));
        });
      })
    ).subscribe();

  }

  deleteImage(image) {
    let task = this.dataProvider.deleteImage(image).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Image removed!',
        duration: 3000
      });
      toast.present();
    });
  }

  // SourceType: Set the source of the picture. Defined in Camera.PictureSourceType. Default is CAMERA. PHOTOLIBRARY : 0, CAMERA : 1, SAVEDPHOTOALBUM : 2
  async takePicture(sourceType: PictureSourceType) {
    try {
      // defining camera options
      const options: CameraOptions = {
        quality: 60,
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

      const image = `data:image/jpeg;base64,${result}`;

      await this.uploadImage(image);

    } catch (e) {
      alert(e);
    }
  }
}
