import { Component } from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
import {
  LocationService,
  MyLocation,
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  MarkerOptions,
  Marker,
  Environment
} from '@ionic-native/google-maps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  map: GoogleMap;
  constructor(public navCtrl: NavController) {
  }

  ionViewDidLoad() {
    this.loadMap();
  }

  loadMap() {

    LocationService.getMyLocation().then((myLocation: MyLocation) => {

      let options: GoogleMapOptions = {
        camera: {
          target: myLocation.latLng,
          zoom: 18,
          tilt: 30
        }
      };
      this.map = GoogleMaps.create('map_canvas', options);
    });
  }

  addMarker() {
    let marker: Marker = this.map.addMarkerSync({
      title: 'My location',
      icon: 'red',
      animation: 'DROP',
      position: this.map.getCameraTarget()
      // position: {
      //   lat: 43.0741904,
      //   lng: -89.3809802
      // }
    });
    marker.on(GoogleMapsEvent.MARKER_CLICK).subscribe(() => {
      alert('clicked');
    });
  }


}
