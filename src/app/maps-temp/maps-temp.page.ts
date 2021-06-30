import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-maps-temp',
  templateUrl: './maps-temp.page.html',
  styleUrls: ['./maps-temp.page.scss'],
})
export class MapsTempPage implements OnInit {

  done: boolean = false

  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 4;
  height = 0;
  address: string;
  private geoCoder;

  currentCli: any = null;
  currentObra: any = null;

  constructor(
    public platform: Platform,
    private route: ActivatedRoute,
    private router: Router,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
  ) {
    console.log(platform.height());
    this.height = platform.height() - 200;
  }

  async ngOnInit() {
    if (this.router.getCurrentNavigation() != null) {
      this.route.queryParams.subscribe(async params => {
        console.log(this.router);
        if (this.router.getCurrentNavigation().extras.state) {
          console.log('con parametros')
          this.currentCli = this.router.getCurrentNavigation().extras.state.detCli;
          console.log(this.router.getCurrentNavigation().extras.state.detObra)
          if (this.router.getCurrentNavigation().extras.state.detObra) {
            console.log('cargar ubicacion recibida');
            this.currentObra = this.router.getCurrentNavigation().extras.state.detObra;
          }
          let resp: any;
          await new Promise((resolve) => {
            this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
              async result => {
                if (!result.hasPermission) {
                  this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                    if (canRequest) {
                      console.log("4");
                    } else {
                      //Show 'GPS Permission Request' dialogue
                      this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
                        .then(
                          async () => {
                            // call method to turn on GPS
                            resp = await this.askToTurnOnGPS();
                          },
                          error => {
                            //Show alert if user click on 'No Thanks'
                            Swal.fire({
                              icon: 'error',
                              title: 'Oops...',
                              text: 'Se requieren permisos de GPS para registrar a los prospectos',

                            }).then(() => {
                              this.navCtrl.navigateBack('/home');
                            })
                          }
                        );
                    }
                  });
                } else {
                  resp = await this.askToTurnOnGPS();
                }
                console.log(resp);
                if (resp.success) {
                  console.log(this.lat);
                  console.log(this.lng);
                  console.log('termina init');
                }
              });
          });

          /******** */


        } else {
          console.log('sin parametros origen cliente')
          this.currentCli = null;
        }
      });
    } else {
      console.log('sin parametros origen modal')
      this.currentCli = null;
    }

  }

  async askToTurnOnGPS() {
    return new Promise((resolve) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        async () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          await this.setCurrentLocation()
          resolve({ success: true })
        },
        error => {
          alert('Error requesting location permissions ' + JSON.stringify(error))
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Se requieren permisos de GPS para registrar a los prospectos',

          }).then(() => {
            resolve({ success: false, data: 'error 1' })
          })
        });
    })

  }

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (this.currentObra) {
            this.lat = this.currentObra.lat_obra;
            this.lng = this.currentObra.lon_obra;
          } else {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }

          this.zoom = 16;
          this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
              if (results[0]) {
                this.address = results[0].formatted_address;
                resolve();
              } else {
                window.alert('No results found');
                resolve();
              }
            } else {
              window.alert('Geocoder failed due to: ' + status);
              resolve();
            }

          });

        });
      }
    })
  }

}




