import { Component, Input, OnInit } from '@angular/core';
import { NavController, Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as firebase from 'firebase/app';
import { AuthService } from '../servicios/auth/auth.service';
import { ObrasService } from '../servicios/obras/obras.service';


@Component({
  selector: 'app-add-obra-mod',
  templateUrl: './add-obra-mod.page.html',
  styleUrls: ['./add-obra-mod.page.scss'],
})
export class AddObraModPage implements OnInit {

  done: boolean = false;

  title: string = 'My first AGM project';
  lat: number = 51.678418;
  lng: number = 7.809007;
  zoom: number = 4;
  height = 0;
  direccion: string;
  private geoCoder;

  currentCli: any = null;
  currentObra: any = null;
  @Input() origen: string = 'obra';
  formObra: FormGroup;
  listaObras = [];

  iconData = {
    url: "./../../assets/img/obra.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }

  constructor(
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private obrasServ: ObrasService
  ) {
    this.height = platform.height() - 350;

    this.formObra = this.fb.group({
      nombre_obra: ['', Validators.required],
      tipo_obra: ['', Validators.required],
      resp_obra: '',
      cont_resp: '',
      direccion_vendedor: ['', Validators.required],
      comentarios: '',
    });

  }

  async ngOnInit() {

    await new Promise<void>((resolve) => {
      if (this.router.getCurrentNavigation() != null) {
        this.route.queryParams.subscribe(async params => {
          if (this.router.getCurrentNavigation().extras.state) {
            this.currentCli = this.router.getCurrentNavigation().extras.state.detCliente;
            if (this.router.getCurrentNavigation().extras.state.detObra) {
              this.currentObra = this.router.getCurrentNavigation().extras.state.detObra;
              resolve();
            } else {
              this.currentObra = null;
              resolve();
            }
          } else {
            this.currentCli = null;
            this.currentObra = null;
            resolve();
          }
        });
      }
      else {
        this.currentCli = null;
        this.currentObra = null;
        resolve();
      }
    })
    this.checkGPSPermission();
  }

  async loadObraData() {
    this.formObra.patchValue({
      nombre_obra: this.currentObra.nombre_obra,
      tipo_obra: this.currentObra.tipo_obra,
      resp_obra: this.currentObra.resp_obra,
      cont_resp: this.currentObra.cont_resp,
      direccion_vendedor: this.currentObra.direccion_vendedor,
      comentarios: this.currentObra.comentarios,
    });

    this.direccion = this.currentObra.direccion_google;

  }

  markerDragEnd($event: google.maps.MouseEvent) {
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    this.getAddress(this.lat, this.lng);
  }

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {

      if (status === 'OK') {
        if (results[0]) {
          this.direccion = results[0].formatted_address;
          this.formObra.patchValue({ direccion_vendedor: this.direccion });
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          if (this.currentObra) {
            this.lat = this.currentObra.lat_obra;
            this.lng = this.currentObra.lon_obra;
            this.loadObraData();
          } else {
            this.lat = position.coords.latitude;
            this.lng = position.coords.longitude;
          }

          this.zoom = 16;
          this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
            if (status === 'OK') {
              if (results[0]) {
                this.direccion = results[0].formatted_address;
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

  checkGPSPermission() {
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
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
                this.navCtrl.navigateBack('/prospectos-list');
              })
            }
          );
      }
    });
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      async () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        //this.getGeolocation()
        this.geoCoder = new google.maps.Geocoder;
        this.obrasServ.getListObrasAll().subscribe(async data => {
          await new Promise<void>((resolve)=>{
            for(let obra of data){
              let urlMarker='';
              if(obra.currentVendedor === this.auth.dataUser['idNumerico']) urlMarker="./../../assets/img/obra_propia.png";
              else  urlMarker="./../../assets/img/obra_otros.png";
              obra['iconData']={
                url: urlMarker,
                scaledSize: {
                  width: 35,
                  height: 35
                }
              }
            }
            resolve();
          })
          this.listaObras = data;
        })
        await this.setCurrentLocation();
        if (this.currentObra) {
          this.loadObraData();
        } else {

        }
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
      post['idSistema'] = this.currentObra.idSistema;
      post['id'] = this.currentObra.id;
      post['lat_obra'] = this.lat;
      post['lon_obra'] = this.lng;
      post['ubic_obra'] = new firebase.firestore.GeoPoint(this.lat, this.lng)
      post['direccion_google'] = this.direccion;
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
      post['vendedorName'] = this.auth.dataUser['displayName'];
      post['lat_obra'] = this.lat;
      post['lon_obra'] = this.lng;
      post['ubic_obra'] = new firebase.firestore.GeoPoint(this.lat, this.lng)
      post['direccion_google'] = this.direccion;
      post['estatus'] = 'activa';
      post['idCli'] = this.currentCli.id;
      post['nombreCli'] = this.currentCli.nombre_cli;
      post['currentVendedor'] = this.auth.dataUser['idNumerico'];

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
          this.lng = null;
          //if (this.origen == 'modal') this.modalController.dismiss({ 'success': true });
          //else this.router.navigate(['/clientes']);
          this.goToObras();
        });
      });


    }

  }

  goToObras() {
    let navigationExtras: NavigationExtras = {
      state: {
        detCli: this.currentCli,
        lat: null,
        lon: null
      }
    };
    this.router.navigate(['/obras'], navigationExtras);
  }

}
