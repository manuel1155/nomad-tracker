import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { AuthService } from '../servicios/auth/auth.service';
import { NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { NetworkService } from '../servicios/network/network.service';

@Component({
  selector: 'app-reg-seguimiento',
  templateUrl: './reg-seguimiento.page.html',
  styleUrls: ['./reg-seguimiento.page.scss'],
})
export class RegSeguimientoPage implements OnInit {

  done: boolean = false;
  height = 0;

  lat2: number = 0;
  lng2: number = 0;

  zoom: number = 12;

  isConnected = false;

  direccion: string;
  private geoCoder;

  bandSeg: boolean = true;

  iconData2 = {
    url: "./../../assets/img/car.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }
  subscriptios: Subscription;
  source = timer(240000, 240000);

  currentTracker: any;

  comentarios: string = "";

  constructor(
    public platform: Platform,
    private auth: AuthService,
    public router: Router,
    private route: ActivatedRoute,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private afs: AngularFirestore,
    private networkService: NetworkService
  ) {
    this.height = platform.height() - 200;

  }

  async ngOnInit() {

    await new Promise<void>((resolve) => {
      if (this.router.getCurrentNavigation() != null) {
        this.route.queryParams.subscribe(async params => {
          if (this.router.getCurrentNavigation().extras.state) {
            this.currentTracker = this.router.getCurrentNavigation().extras.state.tracker;
            console.log(this.currentTracker);
            resolve();
          }
        });
      }
    })
    this.checkGPSPermission();

    this.setCurrentLocation2();

    this.networkService.getNetworkStatus().subscribe((connected: boolean) => {
      this.isConnected = connected;
      if (!this.isConnected) {
        console.log('Por favor enciende tu conexión a Internet');
      }
    });

    this.subscriptios = this.source.subscribe(async val => {
      await this.setCurrentLocation2();
    });

  }

  private setCurrentLocation2(bitacora?: string) {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat2 = position.coords.latitude;
          this.lng2 = position.coords.longitude;

          var SegHist = [];
          if (this.currentTracker.estatus == 'creado') {
            SegHist = [
              {
                idUser: this.auth.currentUserId,
                tipoReg: 'automatico',
                comentario: 'Entrega en curso',
                f_registro: new Date(),
                ubic_user: new firebase.firestore.GeoPoint(this.lat2, this.lng2)
              }
            ]

            this.currentTracker['estatus'] = 'proceso';
            this.currentTracker['seguimientos'] = SegHist;

            this.afs.doc('smaug/nomadtracker/tracker/' + this.currentTracker.id).update({
              estatus: 'proceso',
              seguimientos: SegHist
            })

          } else if (this.currentTracker.estatus == 'proceso') {
            let comentario = 'Entrega en curso';
            let tipoReg = 'automatico';

            if (bitacora) {
              comentario = bitacora;
              tipoReg = 'bitacora';
            }

            SegHist = this.currentTracker['seguimientos'];
            SegHist.push({
              idUser: this.auth.currentUserId,
              tipoReg: tipoReg,
              comentario: comentario,
              f_registro: new Date(),
              ubic_user: new firebase.firestore.GeoPoint(this.lat2, this.lng2)
            });

            this.currentTracker['seguimientos'] = SegHist;

            this.afs.doc('smaug/nomadtracker/tracker/' + this.currentTracker.id).update({
              seguimientos: SegHist
            })
          }
          console.log(SegHist);
          resolve();
        });
      }
    })
  }

  checkGPSPermission() {
    console.log('Entra a checkPermisos');
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        console.log(result)
        if (result.hasPermission) {
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        alert(err);
      }
    );
  }

  askToTurnOnGPS() {
    console.log('function askToTurnOnGPS');
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      async () => {
        console.log('function askToTurnOnGPS despues del then');
        // When GPS Turned ON call method to get Accurate location coordinates
        //this.getGeolocation()
        this.geoCoder = new google.maps.Geocoder;
        await this.setCurrentLocation();
        console.log('done true')
        this.done = true;
      },
      error => {
        alert('Error requesting location permissions ' + JSON.stringify(error))
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se requieren permisos de GPS para registrar a los prospectos',

        }).then(() => {

        })
      }
    );
  }

  requestGPSPermission() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              console.log('requestPermission Error requesting location permissions ',error)
            }
          );
      }
    });
  }

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {

          this.lat2 = position.coords.latitude;
          this.lng2 = position.coords.longitude;

          this.zoom = 16;
          this.geoCoder.geocode({ 'location': { lat: this.lat2, lng: this.lng2 } }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                this.direccion = results[0].formatted_address;
                console.log('resolve ok')
                resolve();
              } else {
                console.log('No results found')
                window.alert('No results found');
                resolve();
              }
            } else {
              console.log('Geocoder failed due to: ' + status);
              window.alert('Geocoder failed due to: ' + status);
              resolve();
            }
          });

        });
      }
    })
  }

  verBitacora() {
    this.comentarios = "";
    this.bandSeg = false;

  }

  cancelBitacora() {
    this.comentarios = "";
    this.bandSeg = true;
  }

  regBitacora() {

    this.setCurrentLocation2(this.comentarios);




  }
}
