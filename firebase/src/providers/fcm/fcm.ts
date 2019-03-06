import { Injectable } from '@angular/core';
import { Firebase } from '@ionic-native/firebase';
import { Platform } from 'ionic-angular';
import {DataProvider} from "../data/data";


@Injectable()
export class FcmProvider {

  constructor(
    public firebaseNative: Firebase,
    public data: DataProvider,
    private platform: Platform
  ) {}

  // Get permission from the user
  async getToken() {

    let token;

    if (this.platform.is('android')) {
      token = await this.firebaseNative.getToken()
    }

    if (this.platform.is('ios')) {
      token = await this.firebaseNative.getToken();
      await this.firebaseNative.grantPermission();
    }

    // Is not cordova == web PWA
    if(!this.platform.is('cordova')) {
      //  TODO add PWA support with angularfire2
    }

    return this.saveTokenToFirestore(token)
  }

  // Save the token to firestore
  private saveTokenToFirestore(token) {
    if (!token) return;

    return this.data.storeTokenFCMToDatabase(token);
  }

  // Listen to incoming FCM messages
  listenToNotifications() {
    return this.firebaseNative.onNotificationOpen()
  }

}
