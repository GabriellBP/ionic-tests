import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
import { Crop } from '@ionic-native/crop';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { DataProvider } from '../providers/data/data';
import {FIREBASE_CONFIG} from "./firebase.config";
import {TestsPage} from "../pages/tests/tests";
import {ProgressBarComponent} from "../components/progress-bar/progress-bar";
import { File } from "@ionic-native/file";
import { RecoveryProvider } from '../providers/recovery/recovery';
import { IonicStorageModule } from '@ionic/storage';
import {BackgroundMode} from '@ionic-native/background-mode/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TestsPage,
    ProgressBarComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TestsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    File,
    Camera,
    ImagePicker,
    Crop,
    BackgroundMode,
    FilePath,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    RecoveryProvider
  ]
})
export class AppModule {}
