import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import Swal from 'sweetalert2';
import { NavController } from '@ionic/angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

declare var google;

@Component({
  selector: 'app-add-visita',
  templateUrl: './add-visita.page.html',
  styleUrls: ['./add-visita.page.scss'],
})
export class AddVisitaPage implements OnInit {


  @ViewChild('mapElement', { static: false }) mapElement: ElementRef;

  lat: number;
  lon: number;
  options: GeolocationOptions;
  currentPos: Geoposition;

  step = 1;  
  //1 == Ubicacion de la obra

  public map: any;
  public marker: any;
  public geoCoder: any;
  public direccion;

  done: boolean = false;

  DataVisita: FormGroup;

  idCli:string=null;
  detCli:any=null;

  constructor(
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private nativeGeocoder: NativeGeocoder,
    private fb: FormBuilder
  ) {
    this.DataVisita = this.fb.group({
      comentarios: ['', Validators.required],
      opcion_visita: ['', Validators.required]
    });
  }

  async ngOnInit(): Promise<void> {
    console.log('inicia init');
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
            console.log(this.lon);
            console.log('termina init');
            this.done = true;

            this.geoCoder = new google.maps.Geocoder();
            this.map = new google.maps.Map(
              this.mapElement.nativeElement,
              {
                center: { lat: this.lat, lng: this.lon },
                zoom: 16
              }
            );

            this.getAddressFromCoords(this.lat, this.lon);

            const position = new google.maps.LatLng(this.lat, this.lon);
            this.marker = new google.maps.Marker({
              position: position,
              title: 'Mi casa',
              map: this.map,
              draggable: true
            });
            google.maps.event.addListener(this.marker, 'dragend', () => {
              console.log(this.marker.getPosition());
              console.log("lat: " + this.marker.position.lat());
              console.log("lng: " + this.marker.position.lng());

              this.getAddressFromCoords(this.marker.position.lat(), this.marker.position.lng());
            });
          }
        });
    });

  }

  get f() { return this.DataVisita.controls; }

  getAddressFromCoords(lattitude, longitude) {
    console.log("getAddressFromCoords " + lattitude + " " + longitude);
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.direccion = "";
        let responseAddress = [];
        console.log(result);
        for (let [key, value] of Object.entries(result[0])) {
          if (value['length'] > 0)
            responseAddress.push(value);

        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.direccion += value + ", ";
        }
        this.direccion = this.direccion.slice(0, -2);
      })
      .catch((error: any) => {
        this.direccion = "Address Not Available!";
      });

  }

  async askToTurnOnGPS() {
    return new Promise((resolve) => {
      this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
        async () => {
          // When GPS Turned ON call method to get Accurate location coordinates
          let posicion = await new Promise((resolve, reject) => {

            this.options = {
              maximumAge: 3000,
              enableHighAccuracy: true
            };
            this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
              console.log(pos)
              this.currentPos = pos;
              this.lat = pos.coords.latitude;
              this.lon = pos.coords.longitude;

              const location = {
                lat: pos.coords.latitude,
                lng: pos.coords.longitude,
                time: new Date(),
              };
              console.log('loc', location);
              resolve(pos);
            }, (err: PositionError) => {
              console.log("error : " + err.message);
              reject(err.message);
            });
          });
          resolve({ success: true, data: posicion })
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
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Se requieren permisos de GPS para registrar a los prospectos',

              }).then(() => {
                console.log('rredireccionar')
                //this.navCtrl.navigateBack('/prospectos-list');
              })
            }
          );
      }
    });
  }

  nextStep() {
    console.log(this.DataVisita.value);
    if (this.f.opcion_visita.value == 'asignar') {
      this.step = 2;
    }
    else {
      this.step = 3;
    }
  }

  verCliente(event: any) {
    if (event.detCliente) {
      this.idCli=event.idCli;
      this.detCli=event.detCliente;
    } else {
      this.idCli=null;
      this.detCli=null;
    }
  }

}
