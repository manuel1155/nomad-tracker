import { Component, Input, OnInit } from '@angular/core';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AuthService } from '../servicios/auth/auth.service';
import Swal from 'sweetalert2';
import * as firebase from 'firebase/app';
import { NavController, Platform } from '@ionic/angular';
import { ObrasService } from '../servicios/obras/obras.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { ClientesService } from '../servicios/clientes/clientes.service';

@Component({
  selector: 'app-add-visita',
  templateUrl: './add-visita.page.html',
  styleUrls: ['./add-visita.page.scss'],
})
export class AddVisitaPage implements OnInit {

  done: boolean = false;
  @Input() step = 1;
  tipoObra: string;

  verHist: boolean = false;

  detCliente: any = {
    idCli: null,
    nombreCli: null,
  }
  tipo_seg: string = "";
  accion_seg: string = "";
  currentObra: any = null;
  verAddCli: boolean = false;

  verAsigCli: boolean = false;
  SelCliente: any = null;

  f_seguimiento = '';
  h_seguimiento = '';

  comenttariosVisita: string = '';
  estatusObra: string = '';

  motivoGeneralTerm: string = "";

  today = '';
  maxDate = '';

  lat: number = 0;
  lng: number = 0;

  latUser: number = 0;
  lngUser: number = 0;
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
  formCliente: FormGroup;

  textFilter: string = '';
  dataFiltros: any = null;

  constructor(
    private auth: AuthService,
    public platform: Platform,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private obrasServ: ObrasService,
    private fb: FormBuilder,
    public router: Router,
    private cliService: ClientesService,
    private route: ActivatedRoute
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

    this.formCliente = this.fb.group({
      nombre_cli: ['', Validators.required],
      rfc_cli: '',
      name_cont_admin_cli: '',
      num_cont_admin_cli: '',
    });

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        let step2 = this.router.getCurrentNavigation().extras.state.step;
        console.log(step2)
        if (step2 === 10) {
          this.cambioStep(1, 'nueva');
        }
        if (step2 === 20) {
          this.currentObra=this.router.getCurrentNavigation().extras.state.obra;
          this.tipoObra = "existente";
          console.log(this.currentObra)
          this.cambioStep(2);
        }
      }
    });
  }

  async ngOnInit(): Promise<void> {

    this.checkGPSPermission();

    this.dataFiltros = new BehaviorSubject({
      obras: 'todas',
      textFilter: '',
    });

  }

  cambioStep(currentStep: number, opcion?: string) {

    if (currentStep == 1) {
      if (opcion == "existente") this.step = currentStep + 1;
      else {
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
          this.step = currentStep + 3;
        })
      }
      this.tipoObra = opcion

    } else if (currentStep == 2) {
      console.log(this.currentObra)
      if (this.currentObra.estatus == 'seguimiento') {

        let f_seg = this.currentObra['f_seguimiento'].toDate();

        let date = ("0" + f_seg.getDate()).slice(-2);
        // current month
        let month = ("0" + (f_seg.getMonth() + 1)).slice(-2);
        // current year
        let year = f_seg.getFullYear();
        // current hours
        let hours = f_seg.getHours();
        // current minutes
        let minutes = f_seg.getMinutes();
        // current seconds
        let seconds = f_seg.getSeconds();
        // prints date & time in YYYY-MM-DD HH:MM:SS format
        let date_str = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
        console.log(date + "-" + month + "-" + year + " " + hours + ":" + minutes);

        Swal.fire({
          title: 'Obra en seguimiento',
          text: "¿La obra tiene un seguimiento programado para el " + date_str + " seguro que deseas registrar la visita?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Si, deseo registrar la visita',
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if (result.isConfirmed) {
            this.step = currentStep + 1;

            let hoy = new Date()

            var dd = String(hoy.getDate()).padStart(2, '0');
            var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = hoy.getFullYear();

            this.today = yyyy + '-' + mm + '-' + dd
            this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd

            this.f_seguimiento = hoy.toISOString();
            this.h_seguimiento = hoy.toISOString();
          }
        })

      } else {
        this.step = currentStep + 1;

        let hoy = new Date()

        var dd = String(hoy.getDate()).padStart(2, '0');
        var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = hoy.getFullYear();

        this.today = yyyy + '-' + mm + '-' + dd
        this.maxDate = (yyyy + 1) + '-' + mm + '-' + dd

        this.f_seguimiento = hoy.toISOString();
        this.h_seguimiento = hoy.toISOString();
      }

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
    if (this.step == 2 && this.tipoObra == "existente") {
      this.step = 1;
    }
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
  }



  updateFilter(text) {
    this.textFilter = text;
    let dataFiltros2 = {
      obras: 'propias',
      textFilter: this.textFilter
    };
    this.dataFiltros.next(dataFiltros2);
    console.log(this.listaObras);
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

    let historial = []
    if (this.tipoObra == 'existente') {
      if (this.currentObra.historial) {
        historial = this.currentObra.historial
      }

      historial.push({
        fecha: new Date(),
        observaciones: this.comenttariosVisita,
        idVendedor: this.auth.currentUserId,
        vendedorName: this.auth.dataUser['displayName'],
        estatus: post['estatus'],
        motivoGral: post['motivoGral'],
        ubic_user: new firebase.firestore.GeoPoint(this.latUser, this.lngUser)
      })
      post['historial'] = historial;

      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();
      post['idSistema'] = this.currentObra.idSistema;
      post['id'] = this.currentObra.id;
      post['vendedorName'] = this.auth.dataUser['displayName'];
      post['currentVendedor'] = this.auth.dataUser['idNumerico'];

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

      historial.push({
        fecha: new Date(),
        observaciones: this.comenttariosVisita,
        idVendedor: this.auth.currentUserId,
        vendedorName: this.auth.dataUser['displayName'],
        estatus: post['estatus'],
        motivoGral: post['motivoGral'],
        ubic_user: new firebase.firestore.GeoPoint(this.latUser, this.lngUser)
      })

      post['historial'] = historial;

      if (this.detCliente.idCli) {
        post['idCli'] = this.detCliente.idCli;
        post['nombreCli'] = this.detCliente.nombreCli;
      }
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

    /*
        try {
    
          
    
          if (this.seguimiento) {
            let f_seg = new Date(this.f_seguimiento);
            let h_seg = new Date(this.h_seguimiento);
            post['estatus'] = 'seguimiento';
            post['f_seguimiento'] = new Date(f_seg.toISOString().substring(0, 10) + ' ' + h_seg.toTimeString().split(' ')[0]);
          } else {
            post['estatus'] = this.estatusObra;
          }
    
          let historial = []
          if (this.tipoObra == 'existente') {
            if (this.currentObra.historial) {
              historial = this.currentObra.historial
            }
    
            historial.push({
              fecha: new Date(),
              observaciones: this.comenttariosVisita,
              idVendedor: this.auth.currentUserId,
              vendedorName: this.auth.dataUser['displayName'],
              estatus: post['estatus']
            })
            post['historial'] = historial;
            post['user_mod'] = this.auth.currentUserId;
            post['f_modificado'] = new Date();
            post['idSistema'] = this.currentObra.idSistema;
            post['id'] = this.currentObra.id;
            post['vendedorName'] = this.auth.dataUser['displayName'];
            post['currentVendedor'] = this.auth.dataUser['idNumerico'];
    
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
            historial.push({
              fecha: new Date(),
              observaciones: this.comenttariosVisita,
              idVendedor: this.auth.currentUserId,
              vendedorName: this.auth.dataUser['displayName'],
              estatus: post['estatus']
            })
    
            post['historial'] = historial;
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
    
        } catch (error) {
          Swal.close();
          Swal.fire({
            title: "Error de registro addVisita " + error.name,
            text: error
          })
        }
    */
  }

  goToHome() {
    this.router.navigate(['/home'], { replaceUrl: true })
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

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.latUser = position.coords.latitude;
          this.lngUser = position.coords.longitude;
          this.zoom = 16;

          this.geoCoder.geocode({ 'location': { lat: this.lat, lng: this.lng } }, (results, status) => {
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
    this.lat = $event.latLng.lat();
    this.lng = $event.latLng.lng();
    this.getAddress(this.lat, this.lng);
  }

  activarSeccion(seccion: string) {
    if (seccion == 'verAsigCli') {
      this.verAsigCli = true; this.step = 0;
    }
    else this.verAsigCli = false;

    if (seccion == 'verAddCli') this.verAddCli = true;
    else this.verAddCli = false;

  }

  verCliente(event: any) {
    this.SelCliente = event.detCliente;
  }

  asigClienteFn() {
    console.log(this.SelCliente);

    if (this.tipoObra == 'existente') {
      let post = {
        id: this.currentObra.id,
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
          this.currentObra['idCli'] = this.SelCliente.id;
          this.currentObra['nombreCli'] = this.SelCliente.nombre_cli;
          this.SelCliente = null;
          this.activarSeccion('verEventDet');
          this.step = 3;
        });
      });
    } else if (this.tipoObra == 'nueva') {
      this.detCliente = {
        idCli: this.SelCliente.id,
        nombreCli: this.SelCliente.nombre_cli
      }
      this.activarSeccion('verEventDet');
      this.step = 3;
    }

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

  cancelCliente() {
    this.verAsigCli = false;
    this.step = 3;
  }

  activarHistorial() {
    if (this.verHist) this.verHist = false;
    else this.verHist = true;
  }
}
