import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireStorage} from 'angularfire2/storage';

@Injectable()
export class DataProvider {

  constructor(private db: AngularFireDatabase, private afStorage: AngularFireStorage) {
  }

  getImages() {
    let ref = this.db.list('images');

    return ref.snapshotChanges()
      .pipe(map(data => {
        return data.map(d => ({key: d.payload.key, ...d.payload.val()}))
      }));
  }

  uploadToStorage(image, name) {
    let ref = this.afStorage.ref(name);

    return [ref, ref.putString(image, 'data_url')];
    // return [this.afStorage.upload(newName, image), this.afStorage.ref(newName)];
  }

  uploadToFirebase(_imageBlobInfo, path) {
    return new Promise((resolve, reject) => {
      let fileRef = this.afStorage.ref(path + _imageBlobInfo.fileName);
      let uploadTask = fileRef.put(_imageBlobInfo.imgBlob);
      uploadTask.task.on(
        "state_changed",
        (_snap: any) => {
          alert(
            "progess " +
            (_snap.bytesTransferred / _snap.totalBytes) * 100
          );
        },
        _error => {
          alert(_error);
          reject(_error);
        },
        () => {
          // completion...
          resolve(uploadTask.task.snapshot);
        }
      );
    });
  }

  storeInfoToDatabase(toSave) {
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
