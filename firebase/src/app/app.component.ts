import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import {RecoveryProvider} from "../providers/recovery/recovery";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = HomePage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private recoveryProvider: RecoveryProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.backgroundColorByHexString('#d4000f');

      if (this.recoveryProvider.pendingResult) {
        // go to the right page
      } else {
        splashScreen.hide();
      }
    });

    if (platform.is('android')) {
      platform.resume.subscribe((event:any) => {
        this.handleAndroidCameraRestart(event)
      });
    }
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
}

