import { Component } from '@angular/core';
import {NavController, NavParams, ToastController} from 'ionic-angular';
import {Observable} from "rxjs";
import {Camera, CameraOptions} from "@ionic-native/camera"; //https://ionicframework.com/docs/native/camera/
import {ImagePicker} from "@ionic-native/image-picker"; //https://ionicframework.com/docs/native/image-picker/
import {Crop} from "@ionic-native/crop"; //https://ionicframework.com/docs/native/crop/
import {DataProvider} from "../../providers/data/data";
import {storage} from "firebase";

/**
 * Generated class for the TestsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-tests',
  templateUrl: 'tests.html',
})
export class TestsPage {
  images: Observable<any[]>;

  // defining the name of the image
  private imageName;

  constructor(private camera: Camera,
              public imagePicker: ImagePicker,
              public cropService: Crop,
              public toastCtrl: ToastController,
              private dataProvider: DataProvider) {
    // initializeApp(FIREBASE_CONFIG);
    this.images = this.dataProvider.getImages();

  }
  //--------------------
  addImage() {

  }

  // uploadImage(type, image) {
  //   let uploadTask = this.dataProvider.uploadToStorage(image);
  //   uploadTask.task.on('state_changed',
  //     (snapshot) => {},
  //     () => {},
  //     () => {}
  //   );
  //
  //   uploadTask.then().then(res => {
  //     this.dataProvider.storeInfoToDatabase(res.metadata).then(() => {
  //       let toast = this.toastCtrl.create({
  //         message: 'New Image added!',
  //         duration: 3000
  //       });
  //       toast.present();
  //     });
  //   });
  // }

  deleteImage(image) {
    this.dataProvider.deleteImage(image).subscribe(() => {
      let toast = this.toastCtrl.create({
        message: 'Image removed!',
        duration: 3000
      });
      toast.present();
    })
  }

  viewImage() {

  }
  //--------------------

  async takePhoto() {
    try {
      // defining camera options
      const options: CameraOptions = {
        quality: 50,
        targetHeight: 600,
        targetWidth: 600,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        correctOrientation: true,
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY
      };
      this.imageName = `${new Date().getTime()}.jpeg`;
      const result = await this.camera.getPicture(options);

      const image = `data:image/jpeg;base64,${result}`;

      // this.uploadImage(0, image);
      // const pictures = storage().ref(`camera/${this.imageName}`);
      // pictures.putString(image, 'data_url');

    } catch (e) {
      alert(e);
    }
  }


  openImagePicker(){
    this.imageName = `${new Date().getTime()}.jpeg`;
    try {
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if (result == false) {
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          }
          else if (result == true) {
            this.imagePicker.getPictures({
              maximumImagesCount: 1
            }).then(
              (results) => {
                for (var i = 0; i < results.length; i++) {
                  const image = `data:image/jpeg;base64,${results[i]}`;
                  const pictures = storage().ref(`imagePicker/${this.imageName}`);
                  pictures.putString(image, 'data_url');
                }
              }, (err) => {
                let toast = this.toastCtrl.create({
                  message: 'erro1',
                  duration: 3000
                });
                toast.present();
              }
            );
          }
        }, (err) => {
          let toast = this.toastCtrl.create({
            message: 'erro2',
            duration: 3000
          });
          toast.present();
        });
    } catch(e) {
      alert(e);
      let toast = this.toastCtrl.create({
        message: 'erroTrypick',
        duration: 3000
      });
      toast.present();
    }
  }

  openImagePickerCrop(){
    this.imageName = `${new Date().getTime()}.jpeg`;
    try {
      this.imagePicker.hasReadPermission().then(
        (result) => {
          if(result == false){
            // no callbacks required as this opens a popup which returns async
            this.imagePicker.requestReadPermission();
          }
          else if(result == true){
            this.imagePicker.getPictures({
              maximumImagesCount: 1
            }).then(
              (results) => {
                for (var i = 0; i < results.length; i++) {
                  this.cropService.crop(results[i], {quality: 75}).then(
                    newImage => {
                      const image = `data:image/jpeg;base64,${newImage}`;
                      const pictures = storage().ref(`imageCropPicker/${this.imageName}`);
                      pictures.putString(image, 'data_url');
                    },
                    error => {
                      let toast = this.toastCtrl.create({
                        message: 'erro3',
                        duration: 3000
                      });
                      toast.present();
                    }
                  );
                }
              }, (err) => {
                let toast = this.toastCtrl.create({
                  message: 'erro4',
                  duration: 3000
                });
                toast.present();
              }
            );
          }
        }, (err) => {
          let toast = this.toastCtrl.create({
            message: 'erro5' +
              '',
            duration: 3000
          });
          toast.present();
        });
    } catch(e) {
      alert(e);
      let toast = this.toastCtrl.create({
        message: 'erroTrypickCrop',
        duration: 3000
      });
      toast.present();
    }
  }

}
