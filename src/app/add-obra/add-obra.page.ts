import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../servicios/auth/auth.service';
import { ObrasService } from '../servicios/obras/obras.service';

declare var google;

@Component({
  selector: 'app-add-obra',
  templateUrl: './add-obra.page.html',
  styleUrls: ['./add-obra.page.scss'],
})
export class AddObraPage implements OnInit {

  currentCli: any = null;
  currentObra: any = null;

  //@ViewChild('mapElement', { static: false }) mapElement: ElementRef;
  lat: number;
  lon: number;
  options: GeolocationOptions;
  currentPos: Geoposition;
  public map: any;
  public geoCoder: any;
  public direccion;

  private step=1;

  latitude: -99.609050;
  longitude: 22.398134;
  marker: {
    latitude: number,
    longitude: number,
    draggable: true
  };

  @Input() origen: string = 'obra';

  formObra: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public geolocation: Geolocation,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private nativeGeocoder: NativeGeocoder,
    private fb: FormBuilder,
    private auth: AuthService,
    private obrasServ: ObrasService
  ) {

    this.formObra = this.fb.group({
      nombre_obra: ['', Validators.required],
      tipo_obra: ['', Validators.required],
      resp_obra: '',
      cont_resp: '',
      direccion_vendedor: ['', Validators.required],
      comentarios: '',
    });

  }

  async loadCliData() {
    this.formObra.patchValue({
      nombre_obra: this.currentObra.nombre_obra,
      tipo_obra: this.currentObra.tipo_obra,
      resp_obra: this.currentObra.resp_obra,
      cont_resp: this.currentObra.cont_resp,
      direccion_vendedor: this.currentObra.direccion_vendedor,
      comentarios: this.currentObra.comentarios,
    });

    this.direccion = this.currentObra.direccion_google;

    /*********** */


    console.log(this.currentObra);

    this.lat = this.currentObra.lat_obra;
    this.lon = this.currentObra.lon_obra;

    console.log('Obra lat: ' + this.lat);
    console.log('Obra lon: ' + this.lon);

    this.geoCoder = new google.maps.Geocoder();
    /*this.map = new google.maps.Map(
      this.mapElement.nativeElement,
      {
        center: { lat: this.lat, lng: this.lon },
        zoom: 16
      }
    );*/
    //this.getAddressFromCoords(this.lat, this.lon);
    const position = new google.maps.LatLng(this.lat, this.lon);
    this.marker = new google.maps.Marker({
      position: position,
      title: 'Mi casa',
      map: this.map,
      draggable: true
    });

  }

  ngOnInit() {
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
          } else {
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

                    /*this.geoCoder = new google.maps.Geocoder();
                    this.map = new google.maps.Map(
                      this.mapElement.nativeElement,
                      {
                        center: { lat: this.lat, lng: this.lon },
                        zoom: 16
                      }
                    );*/
                    this.getAddressFromCoords(this.lat, this.lon);
                    const position = new google.maps.LatLng(this.lat, this.lon);
                    this.marker = new google.maps.Marker({
                      position: position,
                      title: 'Mi casa',
                      map: this.map,
                      draggable: true
                    });
                  }
                });
            });

            /******** */

          }
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

  ngAfterViewInit() {
    console.log('ngAfterViewInit')
    if (this.currentObra) {
      this.loadCliData();
      console.log('con datos de obra')
    } else {
      console.log('sin datos')
    }
  }

  onMapClicked($event) {
    console.log($event);
    this.marker = {
      latitude: $event.coords.lat,
      longitude: $event.coords.lng,
      draggable: true
    };
  }

  getAddressFromCoords(lattitude, longitude) {
    let options: NativeGeocoderOptions = {
      useLocale: true,
      maxResults: 5
    };

    this.nativeGeocoder.reverseGeocode(lattitude, longitude, options)
      .then((result: NativeGeocoderResult[]) => {
        this.direccion = "";
        let responseAddress = [];
        for (let [key, value] of Object.entries(result[0])) {
          if (value['length'] > 0)
            responseAddress.push(value);
        }
        responseAddress.reverse();
        for (let value of responseAddress) {
          this.direccion += value + ", ";
        }
        this.direccion = this.direccion.slice(0, -2);
        this.formObra.patchValue({ direccion_vendedor: this.direccion });
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
              this.currentPos = pos;
              this.lat = pos.coords.latitude;
              this.lon = pos.coords.longitude;

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
                console.log('redireccionar')
                //this.navCtrl.navigateBack('/prospectos-list');
              })
            }
          );
      }
    });
  }

  goToObras() {
    console.log(this.currentCli)
    let navigationExtras: NavigationExtras = {
      state: {
        detCli: this.currentCli,
        lat: null,
        lon: null
      }
    };
    this.router.navigate(['/obras'], navigationExtras);
  }

  guardarObra() {
    Swal.fire({
      title: "Registrando Obra",
      text: "La información se esta subiendo al sistema",
      showCloseButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let post = this.formObra.value;

    if (this.currentObra) {
      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();
      post['idSistema'] = this.currentCli.idSistema;
      post['id'] = this.currentCli.id;
      this.obrasServ.updateObra(post).then((data) => {
        Swal.close();
        Swal.fire({
          title: "Obra modificada",
          text: "La obra ha sido modificado correctamente.",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.formObra.reset();
          this.goToObras();
        });
      });
    }
    else {
      post['user_reg'] = this.auth.currentUserId;
      post['lat_obra'] = this.lat;
      post['lon_obra'] = this.lon;
      post['ubic_obra'] = new firebase.firestore.GeoPoint(this.lat, this.lon)
      post['direccion_google'] = this.direccion;
      post['estatus'] = 'activa';
      post['idCli'] = this.currentCli.id;

      this.obrasServ.createObra(post).then((data) => {
        Swal.close();
        Swal.fire({
          title: "Obra registrada",
          text: "El obra ha sido registrada correctamente; el ID con el que se registro es " + data['idSistema'] + ".",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.formObra.reset();
          this.lat = null;
          this.lat = null;
          //if (this.origen == 'modal') this.modalController.dismiss({ 'success': true });
          //else this.router.navigate(['/clientes']);
          this.goToObras();
        });
      });


    }

  }

}
