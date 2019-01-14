import { Injectable } from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class DataProvider {

  constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) {
  }

  getImages() {
    let ref = this.db.list('images');

    return ref.snapshotChanges()
      .map(changes => {
        return changes.map(c => ({key: c.payload.key, ...c.payload.val()}))
      });
  }

  uploadToStorage(image) {
    let newName = `camera/${new Date().getTime()}.jpeg`;

    return this.afStorage.ref(newName).putString(image, 'data_url');
  }

  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      url: metainfo.downloadURLs[0],
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    };

    return this.db.list('images').push(toSave);
  }

  deleteImage(image) {
    let key = image.key;
    let storagePath = image.fullPath;

    // Removes entry from database
    this.db.list('images').remove(key);

    // Remove image from storage
    return this.afStorage.ref(storagePath).delete();
  }

}
