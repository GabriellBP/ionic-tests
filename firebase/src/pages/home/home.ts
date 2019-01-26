import { Component } from '@angular/core';
import {ToastController} from 'ionic-angular';
import {Camera, CameraOptions, PictureSourceType} from '@ionic-native/camera';
import {Observable} from "rxjs";
import {DataProvider} from "../../providers/data/data";
import {finalize} from 'rxjs/operators';
import { File } from "@ionic-native/file";

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
              private dataProvider: DataProvider,
              private file: File) {

    this.images = this.dataProvider.getImages();
  }

  uploadImage(image) {
    const dateNow = new Date().getTime();
    let newName = `images/${dateNow}.jpeg`;
    // const upload = this.dataProvider.uploadStringToStorage(image, newName);
    const upload = this.dataProvider.uploadBlobToStorage(image, newName);
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
        quality: 80,
        destinationType: this.camera.DestinationType.DATA_URL, // DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible
        sourceType: sourceType,
        allowEdit: true, // Allow simple editing of image before selection. Cut image for example.
        encodingType: this.camera.EncodingType.JPEG,
        targetWidth: 720,
        targetHeight: 480,
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

  // FILE STUFF
  makeFileIntoBlob(_imagePath) {
    // INSTALL PLUGIN - cordova plugin add cordova-plugin-file
    return new Promise((resolve, reject) => {
      let fileName = "";
      this.file
        .resolveLocalFilesystemUrl(_imagePath)
        .then(fileEntry => {
          let { name, nativeURL } = fileEntry;
          // get the path..
          let path = nativeURL
            .substring(0, nativeURL.lastIndexOf("/"));
          fileName = name;
          // we are provided the name, so now read the file
          // into a buffer
          return this.file.readAsArrayBuffer(path, name);
        })
        .then(buffer => {
          // get the buffer and make a blob to be saved
          let imgBlob = new Blob([buffer], {
            type: "image/jpeg"
          });
          // pass back blob and the name of the file for saving
          // into fire base
          resolve({
            fileName,
            imgBlob
          });
        })
        .catch(e => reject(e));
    });
  }

  async takePictureWithFILR_URI(sourceType: PictureSourceType) {
    const options: CameraOptions = {
      quality: 80,
      destinationType: this.camera.DestinationType.FILE_URI, // DATA_URL can be very memory intensive and cause app crashes or out of memory errors. Use FILE_URI or NATIVE_URI if possible
      sourceType: sourceType,
      allowEdit: true, // Allow simple editing of image before selection. Cut image for example.
      encodingType: this.camera.EncodingType.JPEG,
      targetWidth: 720,
      targetHeight: 480,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      saveToPhotoAlbum: true,
      cameraDirection: this.camera.Direction.BACK
    };

    try {
      let cameraInfo = await this.camera.getPicture(options);
      let blobInfo = await this.makeFileIntoBlob(cameraInfo);
      // let uploadInfo: any = await this.dataProvider.uploadToFirebase(blobInfo, 'images/');
      // alert("File Upload Success " + uploadInfo.fileName);
      // @ts-ignore
      let uploadInfo: any = await this.uploadImage(blobInfo.imgBlob);
      alert("File Upload Success");
    }catch (e) {
      alert("File Upload Error " + e.message);
    }
  }
}
