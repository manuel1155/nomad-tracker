import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { NavController } from '@ionic/angular';
import Swal from 'sweetalert2';
import { AuthService } from '../servicios/auth/auth.service';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-checador',
  templateUrl: './checador.page.html',
  styleUrls: ['./checador.page.scss'],
})
export class ChecadorPage implements OnInit {

  entrada: boolean = false;
  done: boolean = false;

  date = new Date();

  listCheck: any = null;

  latUser: number = 0;
  lngUser: number = 0;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
  ) { }

  async ngOnInit() {
    await this.auth.getUserData();

    this.checkGPSPermission();

    let hoy = new Date();

    var dd = String(hoy.getDate()).padStart(2, '0');
    var mm = String(hoy.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = hoy.getFullYear();

    await new Promise<void>((resolve) => {
      this.afs.collection('/smaug/totalconcretos/checador', ref =>
        ref
          .where('idUser', '==', this.auth.currentUserId)
          .orderBy('f_registro')
          .startAt(new Date(yyyy + '-' + mm + '-' + dd + ' 00:30'))
          .endAt(new Date(yyyy + '-' + mm + '-' + dd + ' 23:30'))
      ).valueChanges().subscribe((data) => {
        this.listCheck = data;
        resolve();
      })

    })

    if(this.listCheck.length > 0){
      if (this.listCheck[this.listCheck.length - 1]['tipoReg'] == 'entrada') this.entrada = true;
      else this.entrada = false;
    }
    

    this.done = true;
  }

  registroEntrada() {

    let tipoReg = "";
    if (this.entrada) tipoReg = 'salida';
    else tipoReg = 'entrada';

    Swal.fire({
      title: 'Registrar ' + tipoReg,
      text: "¿Desear registrar tu " + tipoReg + " en este momento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, deseo registrar la ' + tipoReg,
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {

        Swal.fire({
          title: "Registrando datos de la " + tipoReg,
          text: "La información se esta subiendo al sistema",
          showCloseButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        await this.setCurrentLocation();

        this.afs.collection('/smaug/totalconcretos/checador').add({
          idUser: this.auth.currentUserId,
          tipoReg: tipoReg,
          f_registro: new Date(),
          ubic_user: new firebase.firestore.GeoPoint(this.latUser, this.lngUser)
        }).then(() => {
          Swal.close();
          Swal.fire({
            title: "Registro realizado",
            text: "La " + tipoReg + " se ha registrado correctamente.",
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {
            if (this.entrada) this.entrada = false;
            else this.entrada = true;
            console.log(this.entrada);
          })
        })
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

        await this.setCurrentLocation();
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
          resolve()
        });
      }
    })
  }

}
