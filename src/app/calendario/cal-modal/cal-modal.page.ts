import { Component, AfterViewInit } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AuthService } from 'src/app/servicios/auth/auth.service';
import { ObrasService } from 'src/app/servicios/obras/obras.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Platform } from '@ionic/angular';
import Swal from 'sweetalert2';
import { ClientesService } from 'src/app/servicios/clientes/clientes.service';
import { CallNumber } from '@ionic-native/call-number/ngx';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-cal-modal',
  templateUrl: './cal-modal.page.html',
  styleUrls: ['./cal-modal.page.scss'],
})
export class CalModalPage implements AfterViewInit {
  calendar = {
    mode: 'month',
    currentDate: new Date()
  };
  viewTitle: string;

  modalReady = false;

  latUser: number = 0;
  lngUser: number = 0;
  private geoCoder;

  event: any = null;
  bar;

  tipo_seg: string = "";
  accion_seg: string = "";

  motivoGeneralTerm: string = "";

  verEditObra: boolean = false;
  verEventDet: boolean = true;
  verHist: boolean = false;
  verRegSeguimiento: boolean = false;
  verAsigCli: boolean = false;
  verAddCli: boolean = false;

  seguimiento: boolean = false;
  f_seguimiento = '';
  h_seguimiento = '';

  comenttariosVisita: string = '';
  estatusObra: string = '';

  today = '';
  maxDate = '';

  formCliente: FormGroup;
  formObra: FormGroup;

  SelCliente: any = null;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private obrasServ: ObrasService,
    public platform: Platform,
    private cliService: ClientesService,
    private callNumber: CallNumber,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
  ) {
    this.formCliente = this.fb.group({
      nombre_cli: ['', Validators.required],
      rfc_cli: '',
      name_cont_admin_cli: '',
      num_cont_admin_cli: '',
    });

    this.formObra = this.fb.group({
      resp_obra: '',
      cont_resp: '',
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;
      this.checkGPSPermission();
    }, 0);
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  onTimeSelected(ev) {
    this.event.startTime = new Date(ev.selectedTime);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  verSeguimiento() {
    let hoy = new Date()

    var dd = String(hoy.getDate()).padStart(2, '0');
    var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = hoy.getFullYear();

    this.today = yyyy + '-' + mm + '-' + dd
    this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd

    this.f_seguimiento = hoy.toISOString();
    this.h_seguimiento = hoy.toISOString();
    this.activarSeccion('verRegSeguimiento');
  }

  verDetObra() {

    this.seguimiento = false;
    this.comenttariosVisita = '';
    this.estatusObra = '';
    this.today = '';
    this.maxDate = '';

    this.activarSeccion('verEventDet')

  }

  openMap() {
    if (this.platform.is('desktop')) {
      window.open('https://www.google.com/maps?q=' + this.event.lat_obra + ',' + this.event.lon_obra);
    }
    else if (this.platform.is('android')) {
      window.open('geo:0,0?q=' + this.event.lat_obra + ',' + this.event.lon_obra + '(' + this.event.nombre_obra + ')', '_system');
    }


  }

  validaVisita() {
    if (this.estatusObra == 'terminada') {
      return (this.motivoGeneralTerm != '' && this.comenttariosVisita != '')
    } else {
      return (this.comenttariosVisita != '' &&
        this.f_seguimiento != '' &&
        this.h_seguimiento != '' &&
        this.tipo_seg != '' &&
        this.accion_seg != '')
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

    if (this.estatusObra != 'terminada') {
      let f_seg = new Date(this.f_seguimiento);
      let h_seg = new Date(this.h_seguimiento);
      post['estatus'] = 'seguimiento';
      post['motivoGral'] = this.estatusObra;
      post['tipo_seg'] = this.tipo_seg;
      post['accion_seg'] = this.accion_seg;
      post['f_seguimiento'] = new Date(f_seg.toISOString().substring(0, 10) + ' ' + h_seg.toTimeString().split(' ')[0]);
    } else {
      post['estatus'] = 'terminada';
      post['motivoGral'] = this.motivoGeneralTerm;
      post['f_termino'] = new Date();
      post['user_termino'] = this.auth.currentUserId;
    }

    let historial = [];

    if (this.event.historial) {
      historial = this.event.historial
    }

    historial.push({
      fecha: new Date(),
      observaciones: this.comenttariosVisita,
      idVendedor: this.auth.currentUserId,
      vendedorName: this.auth.dataUser['displayName'],
      estatus: post['estatus'],
      motivoGral: post['motivoGral'],
      ubic_user: new firebase.firestore.GeoPoint(this.latUser, this.lngUser)
    });
    post['historial'] = historial;
    post['user_mod'] = this.auth.currentUserId;
    post['f_modificado'] = new Date();
    post['idSistema'] = this.event.idSistema;
    post['id'] = this.event.id;
    post['vendedorName'] = this.auth.dataUser['displayName'];
    post['currentVendedor'] = this.auth.dataUser['idNumerico'];

    this.obrasServ.updateObra(post).then((data) => {
      Swal.close();
      Swal.fire({
        title: "Visita registrada",
        text: "Los datos de la visita han sido almacenados correctamente",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.close();
      });
    });
  }

  verCliente(event: any) {
    this.SelCliente = event.detCliente;
  }


  guardarCli() {

    Swal.fire({
      title: "Registrando Clente",
      text: "La información se esta subiendo al sistema",
      showCloseButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    });

    let post = this.formCliente.value;

    post['user_reg'] = this.auth.currentUserId;
    this.cliService.createCliente(post).then((data) => {
      Swal.close();
      Swal.fire({
        title: "Cliente registrado",
        text: "El cliente ha sido registrado correctamente, el ID con el que se registro es " + data['idSistema'] + ".",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.formCliente.reset();
        this.activarSeccion('verAsigCli');
      });
    });
  }

  //idCli
  //nombreCli
  asigClienteFn() {
    console.log(this.SelCliente);
    let post = {
      id: this.event.id,
      idCli: this.SelCliente.id,
      nombreCli: this.SelCliente.nombre_cli
    }

    post['user_mod'] = this.auth.currentUserId;
    post['f_modificado'] = new Date();
    this.obrasServ.updateObra(post).then((data) => {
      Swal.close();
      Swal.fire({
        title: "Obra modificada",
        text: "La obra ha sido modificado correctamente.",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(async () => {
        let resp = await this.cliService.setAddObra(this.SelCliente.id)
        this.event['idCli'] = this.SelCliente.id;
        this.event['nombreCli'] = this.SelCliente.nombre_cli;
        this.SelCliente = null;
        this.activarSeccion('verEventDet')
      });
    });
    //this.obrasServ.updateObra(post)
  }

  actualizarObra() {
    let post = this.formObra.value;

    post['user_mod'] = this.auth.currentUserId;
    post['f_modificado'] = new Date();
    post['id'] = this.event.id;
    post['idSistema'] = this.event.idSistema;
    this.obrasServ.updateObra(post).then((data) => {
      Swal.close();
      Swal.fire({
        title: "Obra modificada",
        text: "La obra ha sido modificado correctamente.",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(async () => {
        this.event['resp_obra'] = post['resp_obra'];
        this.event['cont_resp'] = post['cont_resp'];
        this.activarSeccion('verEventDet')
      });
    });

  }

  activarSeccion(seccion: string) {

    if (seccion == 'verHist') this.verHist = true;
    else this.verHist = false;

    if (seccion == 'verEditObra') this.verEditObra = true;
    else this.verEditObra = false;

    if (seccion == 'verEventDet') this.verEventDet = true;
    else this.verEventDet = false;

    if (seccion == 'verAddCli') this.verAddCli = true;
    else this.verAddCli = false;

    if (seccion == 'verAsigCli') this.verAsigCli = true;
    else this.verAsigCli = false;

    if (seccion == 'verRegSeguimiento') this.verRegSeguimiento = true;
    else this.verRegSeguimiento = false;
  }

  callNow() {

    let numberCall = this.event.cont_resp.toString();

    let finalNumberCall = numberCall.replace(/\D/g, "");

    if (finalNumberCall.length == 10) {
      this.callNumber.callNumber(finalNumberCall, true)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    } else {
      Swal.fire({
        title: "Error en número",
        text: "El número almaenado no es valido",
        icon: 'error',
        confirmButtonText: 'Aceptar'
      }).then(() => {
      });
    }


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
              //Show alert if user click on 'No Thanks
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
        // When GPS Turned ON call method to get Accurate location coordinates
        //this.getGeolocation()
        this.geoCoder = new google.maps.Geocoder;
        await this.setCurrentLocation();
        //this.done = true;
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

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.latUser = position.coords.latitude;
          this.lngUser = position.coords.longitude;
          resolve();
        });
      }
    })
  }
}