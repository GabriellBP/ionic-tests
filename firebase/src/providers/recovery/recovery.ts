import { Injectable } from '@angular/core';
import {Platform} from "ionic-angular";
import { Storage } from '@ionic/storage';


@Injectable()
export class RecoveryProvider {
  pendingResult: string;

  constructor(private platform: Platform,
              private storage: Storage) {

  }

  saveStateRecovery(recovery: string): Promise<string> {
    return this.storage.set('state_recovery', recovery);
  }

  getStateRecovery(): Promise<string> {
    return this.storage.get('state_recovery');
  }

  removeStateRecovery(): Promise<string> {
    return this.storage.remove('state_recovery');
  }

  // saveForRecovery(object: any): Promise<{}> {
  //   return new Promise((resolve) => {
  //     if (this.platform.is('android')) { //camera error just occurs in android platform
  //       this.storage.set('key', object).then((recover: any) => {
  //         resolve();
  //       });
  //     } else {
  //       resolve();
  //     }
  //   });
  // }

}
