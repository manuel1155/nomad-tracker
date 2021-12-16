import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { AuthService } from '../servicios/auth/auth.service';
import { ProspectoService } from '../servicios/prospecto/prospecto.service';
import { Geolocation, GeolocationOptions, Geoposition, PositionError } from '@ionic-native/geolocation/ngx';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';

@Component({
  selector: 'app-reg-prosp-ini',
  templateUrl: './reg-prosp-ini.page.html',
  styleUrls: ['./reg-prosp-ini.page.scss'],
})
export class RegProspIniPage implements OnInit, OnDestroy {

  subscriptios: Subscription;

  DataProspForm: FormGroup;
  done = false;
  dataTrabajo = false;
  lat: number;
  lon: number;
  options: GeolocationOptions;
  currentPos: Geoposition;

  arrayImagenes = [
    {
      url: './assets/img/recibo-luz.png',
      upload: false,
      take: false,
      id: 'luz',
      titulo: 'Recibo Luz',
      icon: 'flash'
    }, {
      url: './assets/img/recibo-agua.png',
      upload: false,
      take: false,
      id: 'agua',
      titulo: 'Recibo de agua',
      icon: 'water'
    }, {
      url: './assets/img/ine-anverso.png',
      upload: false,
      take: false,
      id: 'ine-front',
      titulo: 'INE Anverso',
      icon: 'card'
    }, {
      url: './assets/img/ine-reverso.jpg',
      upload: false,
      take: false,
      id: 'ine-back',
      titulo: 'INE Reverso',
      icon: 'card'
    }, {
      url: './assets/img/solicitud.png',
      upload: false,
      take: false,
      id: 'solicitud',
      titulo: 'Solicitud',
      icon: 'document'
    }
  ]

  bandGeoPos = false;

  public prod_int = [
    { val: 'AC (Aire acondicionado)', isChecked: false },
    { val: 'AT (Aislamiento térmico)', isChecked: false },
    { val: 'RF (Refrigerador)', isChecked: false },
    { val: 'LD (Lamparas led)', isChecked: false },
    { val: 'FT (Paneles solares)', isChecked: false },
    { val: 'LV (Lavadoras)', isChecked: false },
  ];

  foto_select = 'luz';

  page: any;

  currentProsp: any = null;

  constructor(private auth: AuthService,
    private fb: FormBuilder,
    private navCtrl: NavController,
    private prospService: ProspectoService,
    public geolocation: Geolocation,
    private afs: AngularFirestore,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private route: ActivatedRoute,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.DataProspForm = this.fb.group({
      colonia: [{ value: '', disabled: true }, Validators.required],
      cp: [{ value: '', disabled: true }, Validators.required],
      calle: ['', Validators.required],
      numero: ['', Validators.required],
      contacto: [null, Validators.required],
      interes: [null],
      nombre_prosp: [''],
      telefono_prosp: [null],
      comentarios: [null]
    });

    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.currentProsp = this.router.getCurrentNavigation().extras.state.prosp;
        this.loadProspData();
      } else {
        this.initFormNew();
        this.currentProsp = null;
      }
    });
  }

  ngOnInit() {

  }

  initFormNew() {
    this.subscriptios = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();
        if (this.auth.dataUser['areaTrabajo']) {
          if (this.auth.dataUser['areaTrabajo']['colonia'] != '' && this.auth.dataUser['areaTrabajo']['cp'] != '') {
            let calleLS = '';

            if (localStorage.getItem("calle") !== null) calleLS = localStorage.getItem("calle")
            this.DataProspForm.patchValue({
              colonia: this.auth.dataUser['areaTrabajo']['colonia'],
              cp: this.auth.dataUser['areaTrabajo']['cp'],
              calle: calleLS
            });

          }
        }
        this.DataProspForm.controls['interes'].disable();
        this.DataProspForm.controls['interes'].clearValidators();

        this.DataProspForm.controls['nombre_prosp'].disable();
        this.DataProspForm.controls['nombre_prosp'].clearValidators();

        this.DataProspForm.controls['telefono_prosp'].disable();
        this.DataProspForm.controls['telefono_prosp'].clearValidators();

        this.DataProspForm.controls['comentarios'].disable();
        this.DataProspForm.controls['comentarios'].clearValidators();
        await this.checkGPSPermission();
        this.done = true;

        this.dataTrabajo = true;
        this.onChanges();
      }
    });
  }

  async loadProspData() {
    this.subscriptios = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();
      }
    });
    this.DataProspForm.controls['interes'].enable();
    this.DataProspForm.controls['interes'].setValidators([Validators.required]);
    this.DataProspForm.controls['interes'].updateValueAndValidity();

    this.DataProspForm.controls['nombre_prosp'].enable();
    this.DataProspForm.controls['nombre_prosp'].setValidators([Validators.required]);
    this.DataProspForm.controls['nombre_prosp'].updateValueAndValidity();

    this.DataProspForm.controls['telefono_prosp'].enable();
    this.DataProspForm.controls['telefono_prosp'].setValidators([
      Validators.required,
      Validators.pattern(/^-?(0|[1-9]\d*)?$/),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
    this.DataProspForm.controls['telefono_prosp'].updateValueAndValidity();

    this.DataProspForm.controls['comentarios'].enable();
    this.DataProspForm.controls['comentarios'].setValidators([]);
    this.DataProspForm.controls['comentarios'].updateValueAndValidity();

    this.DataProspForm.patchValue({
      calle: this.currentProsp['calle'] ? this.currentProsp['calle'] : '',
      colonia: this.currentProsp['colonia'] ? this.currentProsp['colonia'] : '',
      cp: this.currentProsp['cp'] ? this.currentProsp['cp'] : '',
      comentarios: this.currentProsp['comentarios'] ? this.currentProsp['comentarios'] : '',
      contacto: this.currentProsp['contacto'] ? this.currentProsp['contacto'] : '',
      interes: this.currentProsp['interes'] ? this.currentProsp['interes'] : '',
      numero: this.currentProsp['numero'] ? this.currentProsp['numero'] : '',
      nombre_prosp: this.currentProsp['nombre_prosp'] ? this.currentProsp['nombre_prosp'] : '',
      telefono_prosp: this.currentProsp['telefono_prosp'] ? this.currentProsp['telefono_prosp'] : '',
    });

    for (let img of this.currentProsp['arrayImg']) {
      if (img.upload) {
        await new Promise<void>((resolve) => {
          const imgRef = this.storage.ref(img.url);
          imgRef.getDownloadURL().subscribe(downloadURL => {
            img['url2'] = downloadURL;
            resolve();
          });
        })
      }
    }

    for (let prod of this.currentProsp['prod_int']) {
      this.prod_int.filter(p => p.val == prod)[0]['isChecked'] = true;
    }

    this.arrayImagenes = this.currentProsp['arrayImg'];
    this.dataTrabajo = true;
    this.done = true;
  }

  get f() { return this.DataProspForm.controls; }

  onChanges(): void {

    this.f.calle.valueChanges.subscribe(calle => {
      this.DataProspForm.patchValue({ calle: calle.toUpperCase() }, { emitEvent: false })
    });

    this.f.numero.valueChanges.subscribe(numero => {
      this.DataProspForm.patchValue({ numero: numero.toUpperCase() }, { emitEvent: false })
    });

    this.f.nombre_prosp.valueChanges.subscribe(nombre_prosp => {
      this.DataProspForm.patchValue({ nombre_prosp: nombre_prosp.toUpperCase() }, { emitEvent: false })
    });

    this.f.contacto.valueChanges.subscribe(contacto => {
      if (contacto) {
        this.DataProspForm.controls['interes'].enable();
        this.DataProspForm.controls['interes'].setValidators([Validators.required]);
        this.DataProspForm.controls['interes'].updateValueAndValidity();
      } else {
        this.DataProspForm.controls['interes'].disable();
        this.DataProspForm.controls['interes'].clearValidators();
      }
    });

    this.f.interes.valueChanges.subscribe(interes => {
      if (interes) {
        this.DataProspForm.controls['nombre_prosp'].enable();
        this.DataProspForm.controls['nombre_prosp'].setValidators([Validators.required]);
        this.DataProspForm.controls['nombre_prosp'].updateValueAndValidity();

        this.DataProspForm.controls['telefono_prosp'].enable();
        this.DataProspForm.controls['telefono_prosp'].setValidators([
          Validators.required,
          Validators.pattern(/^-?(0|[1-9]\d*)?$/),
          Validators.minLength(10),
          Validators.maxLength(10)
        ]);
        this.DataProspForm.controls['telefono_prosp'].updateValueAndValidity();

        this.DataProspForm.controls['comentarios'].enable();
        this.DataProspForm.controls['comentarios'].setValidators([]);
        this.DataProspForm.controls['comentarios'].updateValueAndValidity();
      } else {
        this.DataProspForm.controls['nombre_prosp'].disable();
        this.DataProspForm.controls['nombre_prosp'].clearValidators();

        this.DataProspForm.controls['telefono_prosp'].disable();
        this.DataProspForm.controls['telefono_prosp'].clearValidators();

        this.DataProspForm.controls['comentarios'].disable();
        this.DataProspForm.controls['comentarios'].clearValidators();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptios.unsubscribe();
  }

  getImg(idImg: string) {
    if (this.arrayImagenes.filter(img => img.id == idImg)[0]['upload']) return this.arrayImagenes.filter(img => img.id == idImg)[0]['url2'];
    else return this.arrayImagenes.filter(img => img.id == idImg)[0]['url'];
  }

  cancelProsp() {
    Swal.fire({
      title: "Cancelar Prospecto",
      text: "¿Seguro que deseas cancelar el registro del prospecto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Cancelar',
      cancelButtonText: 'Regresar'
    }).then((result) => {
      if (result.value) {
        this.navCtrl.navigateBack('/prospectos-list');
      }
    })
  }

  async guardarProspecto() {
    Swal.fire({
      title: "Registrando Prospecto",
      text: "La información se esta subiendo al sistema",
      showCloseButton: false,
      allowEscapeKey: false,
      allowOutsideClick: false,
      showConfirmButton: false,
    
    });

    let post = this.DataProspForm.value;
    let estatus = 'terminado';
    let id = '';

    let arrayProsInt = [];

    if (this.currentProsp) {
      id = this.currentProsp.id;
      post['user_mod'] = this.auth.currentUserId;
      post['f_modificado'] = new Date();
      post['idSistema']=this.currentProsp.idSistema;
      post['id'] = id;
    } else {
      id = this.afs.createId();

      post['colonia'] = this.auth.dataUser['areaTrabajo']['colonia'];
      post['cp'] = this.auth.dataUser['areaTrabajo']['cp'];
      post['user_reg'] = this.auth.currentUserId;
      post['user_mod'] = '';
      post['user_ter'] = '';
      post['f_creado'] = new Date();
      post['f_modificado'] = new Date();
      post['f_termiado'] = '';
      post['vendedorName'] = this.auth.dataUser['displayName'];
      post['idVendedor'] = this.auth.dataUser['idNumerico'];
      post['id'] = id;

      if (this.bandGeoPos) {
        post['ubicacion'] = new firebase.firestore.GeoPoint(this.lat, this.lon)
        post['bandUbic'] = true;
      } else {
        post['bandUbic'] = false;
      }
    }

    for (let prod of this.prod_int) {
      if (prod.isChecked) arrayProsInt.push(prod.val);
    }

    if (post['contacto'] && post['interes']) {
      let tempImgs = this.arrayImagenes.filter(img => img.take == true && img.upload == false);

      if (tempImgs.length > 0) {
        for (let img of tempImgs) {
          img.url = await this.upload(img.url, img.id, post['id']);
          img.upload = true;
        }
      }

      if (this.arrayImagenes.filter(img => img.upload).length == this.arrayImagenes.length) estatus = 'creado';
      else estatus = 'incompleto';
    }
    

    for(let img of this.arrayImagenes){
      if(img['url2']) delete img['url2'];
    }

    post['arrayImg'] = this.arrayImagenes;
    post['prod_int'] = arrayProsInt;
    post['estatus'] = estatus;
    
    if(this.currentProsp){
      this.prospService.updateProsp(post).then((data) => {
        Swal.close();
        localStorage.setItem('calle', post['calle']);
        Swal.fire({
          title: "Prospecto actualizado",
          text: "El prospecto "+ data['idSistema'] +"  ha sido actualizado correctamente.",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.navCtrl.navigateBack('/prospectos-list');//lista de prospectos
        });
      });
    }else{
      this.prospService.createProspecto(post).then((data) => {
        Swal.close();
        localStorage.setItem('calle', post['calle']);
        Swal.fire({
          title: "Prospecto registrado",
          text: "El prospecto ha sido registrado correctamente, el número con el que se registro es " + data['idSistema'] + ".",
          icon: 'success',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.navCtrl.navigateBack('/prospectos-list');//lista de prospectos
        });
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
      () => {
        // When GPS Turned ON call method to get Accurate location coordinates
        this.getGeolocation()
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

  getGeolocation() {
    return new Promise((resolve, reject) => {

      this.options = {
        maximumAge: 3000,
        enableHighAccuracy: true
      };
      this.geolocation.getCurrentPosition(this.options).then((pos: Geoposition) => {
        this.currentPos = pos;
        this.lat = pos.coords.latitude;
        this.lon = pos.coords.longitude;

        const location = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          time: new Date(),
        };
        this.bandGeoPos = true;
        resolve(pos);
      }, (err: PositionError) => {
        reject(err.message);
      });
    });
  }

  getCamara(origen: string) {
    const cameraOptions: CameraOptions = {
      quality: 80,
      destinationType: Camera.DestinationType.DATA_URL,
      encodingType: Camera.EncodingType.JPEG,
      mediaType: Camera.MediaType.PICTURE,
      targetWidth: 1536,
      targetHeight: 2048,
      correctOrientation:true,
      saveToPhotoAlbum:true
    };

    Camera.getPicture(cameraOptions)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI // If it's base64:
        this.arrayImagenes.filter(img => img.id == origen)[0]['url'] = 'data:image/jpeg;base64,' + imageData;
        this.arrayImagenes.filter(img => img.id == origen)[0]['take'] = true;
        this.arrayImagenes.filter(img => img.id == origen)[0]['upload'] = false;
      }, (err) => {

      });
  }


  getGaleria(origen: string) {
    const galleryOptions: CameraOptions = {
      quality: 80,
      sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: Camera.DestinationType.DATA_URL,
      allowEdit: false,
      targetWidth: 1536,
      targetHeight: 2048
    };

    Camera.getPicture(galleryOptions)
      .then((imageData) => {
        // imageData is either a base64 encoded string or a file URI // If it's base64:
        this.arrayImagenes.filter(img => img.id == origen)[0]['url'] = 'data:image/jpeg;base64,' + imageData;
        this.arrayImagenes.filter(img => img.id == origen)[0]['take'] = true;
        this.arrayImagenes.filter(img => img.id == origen)[0]['upload'] = false;
      }, (err) => {

      });
  }

  segmentChanged(ev: any) {
    this.foto_select = ev.detail.value;
  }

  upload(imgBase64: string, filename: string, idPros: string): Promise<string> {
    return new Promise<string>((resolve) => {
      let storageRef = firebase.storage().ref();

      const imageRef = storageRef.child(`uploads/totalconcretos/cambaceo/${idPros}/${filename}.jpg`);

      imageRef.putString(imgBase64, firebase.storage.StringFormat.DATA_URL)
        .then((snapshot) => {
          resolve(snapshot.ref.fullPath);
        });
    })
  }

}
