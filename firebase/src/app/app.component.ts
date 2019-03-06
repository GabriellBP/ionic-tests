import { Component } from '@angular/core';
import {AlertController, Platform, ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { Push, PushObject, PushOptions } from '@ionic-native/push';

import { HomePage } from '../pages/home/home';
import {RecoveryProvider} from "../providers/recovery/recovery";
import {DataProvider} from "../providers/data/data";
import {FcmProvider} from "../providers/fcm/fcm";
import {tap} from "rxjs/operators";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
              private recoveryProvider: RecoveryProvider,
              // private push: Push,
              private fcm: FcmProvider,
              private dataProvider: DataProvider,
              public alertCtrl: AlertController,
              public toastCtrl: ToastController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#d4000f');

      if (this.recoveryProvider.pendingResult) {
        // go to the right page
      } else {
        splashScreen.hide();
      }

      // Get a FCM token
      fcm.getToken();

      // Listen to incoming messages
      fcm.listenToNotifications().pipe(
        tap(msg => {
          // show a toast
          const toast = this.toastCtrl.create({
            message: msg.body,
            duration: 3000
          });
          toast.present();
        })
      )
        .subscribe()

    });

    if (platform.is('android')) {
      platform.resume.subscribe((event:any) => {
        this.handleAndroidCameraRestart(event)
      });
    }
    this.pushSetup();
  }

  private handleAndroidCameraRestart(event: any) {
    if (event && event.pendingResult) {
      // const status: string = event.pendingResult.pluginStatus !== null ? '' : event.pendingResult.pluginStatus.toUpperCase();
      const status: boolean = event.pendingResult.pluginStatus === 'OK';

      if ('Camera' === event.pendingResult.pluginServiceName && status && event.pendingResult.result) {
        this.recoveryProvider.pendingResult = event.pendingResult.result;
      }
    }
  }

  private pushSetup() {
    // const options: PushOptions = {
    //   android: {
    //     senderID: 'your-send-ID'
    //   },
    //   ios: {
    //     alert: 'true',
    //     badge: true,
    //     sound: 'false'
    //   }
    // };
    //
    // const pushObject: PushObject = this.push.init(options);
    //
    //
    // pushObject.on('notification').subscribe((notification: any) => {
    //   let youralert = this.alertCtrl.create({
    //     title: notification.label,
    //     message: notification.message
    //   });
    //   youralert.present();
    //
    //   console.log('Received a notification', notification)
    // });
    //
    // pushObject.on('registration').subscribe((registration: any) => {
    //   console.log('Device registered', registration);
    //   this.dataProvider.storeTokenFCMToDatabase(registration.registrationId);
    // });
    //
    // pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }
}

