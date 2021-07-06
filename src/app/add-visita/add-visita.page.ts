import { Component, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AuthService } from '../servicios/auth/auth.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { NavController, Platform } from '@ionic/angular';
import { ObrasService } from '../servicios/obras/obras.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-visita',
  templateUrl: './add-visita.page.html',
  styleUrls: ['./add-visita.page.scss'],
})
export class AddVisitaPage implements OnInit {

  done: boolean = false;
  step = 1;
  tipoObra: string;

  currentObra: any = null;

  seguimiento: boolean = false;
  f_seguimiento = '';
  h_seguimiento = '';

  comenttariosVisita: string = '';
  motivoGral: string = '';
  estatusObra: string = '';

  today = '';
  maxDate = '';

  lat: number = 0;
  lng: number = 0;
  zoom: number = 12;

  listaObras = [];
  private geoCoder;
  direccion: string;

  height = 0;

  iconData = {
    url: "./../../assets/img/obra.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }

  formObra: FormGroup;

  constructor(
    private auth: AuthService,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private obrasServ: ObrasService,
    private fb: FormBuilder,
    public router: Router,
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

  async ngOnInit(): Promise<void> {

    this.checkGPSPermission();

  }

  cambioStep(currentStep: number, opcion?: string) {

    if (currentStep == 1) {
      if (opcion == "existente") this.step = currentStep + 1;
      else {
        this.obrasServ.getListObrasAll().subscribe(data => {
          this.listaObras = data;
          this.step = currentStep + 3;
        })
      }
      this.tipoObra = opcion

    } else if (currentStep == 2) {
      this.step = currentStep + 1;

      let hoy = new Date()

      var dd = String(hoy.getDate()).padStart(2, '0');
      var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = hoy.getFullYear();

      this.today = yyyy + '-' + mm + '-' + dd
      this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd

      this.f_seguimiento = hoy.toISOString();
      this.h_seguimiento = hoy.toISOString();

    } else if (currentStep == 4) {
      this.step = currentStep + 1;

    } else if (currentStep == 5) {
      this.step = 3;

      let hoy = new Date()
      var dd = String(hoy.getDate()).padStart(2, '0');
      var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = hoy.getFullYear();

      this.today = yyyy + '-' + mm + '-' + dd
      this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd

      this.f_seguimiento = hoy.toISOString();
      this.h_seguimiento = hoy.toISOString();
    }


  }

  backStep() {
    if (this.step == 3 && this.tipoObra == "existente") {
      this.step = 2;
    } else if (this.step == 3 && this.tipoObra == "nueva") {
      this.step = 5;
    } else if (this.step == 5) {
      this.step = 4;
    }
  }

  verObra(event: any) {
    this.currentObra = event.detObra
    console.log(this.currentObra)
  }

  cambioToggle(event: any) {
    console.log(this.seguimiento);
  }

  validaExistente() {
    if (this.seguimiento) {
      return (this.comenttariosVisita != '' &&
        this.f_seguimiento != '' &&
        this.h_seguimiento != '')
    } else {
      return (this.comenttariosVisita != '' && this.estatusObra != '')
    }
  }

  validaNueva() {
    if (this.seguimiento) {
      return (this.comenttariosVisita != '' &&
        this.f_seguimiento != '' &&
        this.h_seguimiento != '')
    } else {
      return (this.comenttariosVisita != '' && this.estatusObra != '')
    }
  }

  guardarVisita() {

    Swal.fire({
      title: "Registrando datos de la visita",
      text: "La información se esta subiendo al sistema",
      showCloseButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let post = {}

    if (this.seguimiento) {
      let f_seg = new Date(this.f_seguimiento);
      let h_seg = new Date(this.h_seguimiento);
      post['estatus'] = 'seguimiento';
      console.log(f_seg.toISOString().substring(0, 10) + ' ' + h_seg.toTimeString().split(' ')[0])
      post['f_seguimiento'] = new Date(f_seg.toISOString().substring(0, 10) + ' ' + h_seg.toTimeString().split(' ')[0]);
    } else {
      post['estatus'] = this.estatusObra;
    }

    let historial = []
    if (this.tipoObra == 'existente') {
      console.log('obra existente')
      if (this.currentObra.historial) {
        historial = this.currentObra.historial
      }

      historial.push({
        fecha: new Date(),
        observaciones: this.comenttariosVisita,
        idVendedor: this.auth.currentUserId,
        vendedorName: this.auth.dataUser['displayName']
      })
      post['historial']=historial;
      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();
      post['idSistema'] = this.currentObra.idSistema;
      post['id'] = this.currentObra.id;
      post['vendedorName'] = this.auth.dataUser['displayName'];
      post['currentVendedor'] = this.auth.dataUser['idNumerico'];

      console.log(post);
      this.obrasServ.updateObra(post).then((data) => {
        Swal.close();
        Swal.fire({
          title: "Obra modificada",
          text: "La obra ha sido modificado correctamente.",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.goToHome();
        });
      });

    } else if (this.tipoObra == 'nueva') {
      console.log('crea obra')
      historial.push({
        fecha: new Date(),
        observaciones: this.comenttariosVisita,
        idVendedor: this.auth.currentUserId,
        vendedorName: this.auth.dataUser['displayName']
      })

      post['historial']=historial;
      post['user_reg'] = this.auth.currentUserId;
      post['vendedorName'] = this.auth.dataUser['displayName'];
      post['currentVendedor'] = this.auth.dataUser['idNumerico'];
      post['lat_obra'] = this.lat;
      post['lon_obra'] = this.lng;
      post['ubic_obra'] = new firebase.firestore.GeoPoint(this.lat, this.lng)
      post['direccion_google'] = this.direccion;
      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();

      post = { ...post, ...this.formObra.value }

      console.log(post);
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
          this.goToHome();
        });
      });
    }
  }

  goToHome(){
    this.router.navigate(['/home'],{ replaceUrl: true })
  }


  checkGPSPermission() {
    console.log('Checando los permisos de la APP');
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      result => {
        if (result.hasPermission) {
          console.log('app CON permisos');
          //If having permission show 'Turn On GPS' dialogue
          this.askToTurnOnGPS();
        } else {
          console.log('app SIN permisos');
          //If not having permission ask for permission
          this.requestGPSPermission();
        }
      },
      err => {
        console.log('error de librerias')
        alert(err);
      }
    );
  }

  requestGPSPermission() {
    console.log('solicitar permisos de al usuario');
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        console.log("4");
      } else {
        //Show 'GPS Permission Request' dialogue
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION)
          .then(
            () => {
              // call method to turn on GPS
              console.log('usuario otorga permisos a la APP');
              this.askToTurnOnGPS();
            },
            error => {
              //Show alert if user click on 'No Thanks'
              console.log('usuario niega permisos a la APP');
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
  }

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      async () => {
        console.log('usuario activa el GPS');
        // When GPS Turned ON call method to get Accurate location coordinates
        //this.getGeolocation()
        this.geoCoder = new google.maps.Geocoder;
        await this.setCurrentLocation();
        this.done = true;
        console.log(this.lat, this.lng)
      },
      error => {
        console.log('Usuario no activa el GPS');
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

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.zoom = 16;

          this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
            console.log(results);
            console.log(status);
            if (status === 'OK') {
              if (results[0]) {
                this.direccion = results[0].formatted_address;
                this.formObra.patchValue({ direccion_vendedor: this.direccion });
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

  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      console.log(results);
      console.log(status);
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

  markerDragEnd($event: google.maps.MouseEvent) {
    console.log($event.latLng.lat(), $event.latLng.lng());
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    this.getAddress(this.lat, this.lng);
  }

}
