import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import Swal from 'sweetalert2';
import { ObrasService } from '../servicios/obras/obras.service';
import { Subscription, timer } from 'rxjs';
import { NavigationExtras, Router } from '@angular/router';
import { AuthService } from '../servicios/auth/auth.service';
import { CalModalPage } from '../calendario/cal-modal/cal-modal.page';

@Component({
  selector: 'app-maps-temp',
  templateUrl: './maps-temp.page.html',
  styleUrls: ['./maps-temp.page.scss'],
})

export class MapsTempPage implements OnInit, OnDestroy {

  height = 0;
  done: boolean = false;

  lat: number = 0;
  lng: number = 0;

  lat2: number = 0;
  lng2: number = 0;

  zoom: number = 12;

  listaObras = [];
  listaObrasBack = [];

  iconData = {
    url: "./../../assets/img/obra.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }

  iconData2 = {
    url: "./../../assets/img/car.png",
    scaledSize: {
      width: 35,
      height: 35
    }
  }

  source = timer(4000, 4000);

  subscriptios: Subscription;

  filtro1: string = 'Todas'

  textFilter: string = '';
  dataFiltros: any = null;

  constructor(
    private auth: AuthService,
    public platform: Platform,
    private obrasServ: ObrasService,
    private androidPermissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private navCtrl: NavController,
    private router: Router,
    private modalCtrl: ModalController,
    ) {
    this.height = platform.height() - 200;
  }
  ngOnDestroy(): void {
    this.subscriptios.unsubscribe();
    console.log('close map temp')
  }

  async ngOnInit(): Promise<void> {

    await this.auth.getUserData();

    this.checkGPSPermission();

    this.subscriptios = this.source.subscribe(async val => {
      await this.setCurrentLocation2();
    });
  }

  updateFilter(text?) {
    console.log(text);
    console.log(typeof text);
    if(typeof text === 'string') this.textFilter = text;
    let dataFiltros2 = {
      obras: this.filtro1,
      textFilter: this.textFilter
    };
    console.log(dataFiltros2);
    this.listaObras = []
    console.log(this.auth.dataUser['idNumerico']);
    if (dataFiltros2['obras'] == 'Propias') this.listaObras = this.listaObrasBack.filter(o => o.currentVendedor == this.auth.dataUser['idNumerico'])
    else if (dataFiltros2['obras'] == 'Todas') this.listaObras = this.listaObrasBack;

    if (dataFiltros2['textFilter'] !== '') {
      const val = dataFiltros2['textFilter'].toLowerCase();

      // filter our data
      this.listaObras = this.listaObras.filter(function (d) {
        if (d.nombre_obra) return d.nombre_obra.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    console.log(this.listaObras);
    console.log(this.listaObrasBack);
    //this.rows = dataFilter;
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

  askToTurnOnGPS() {
    this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
      async () => {
        // When GPS Turned ON call method to get Accurate location coordinates

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

  private setCurrentLocation() {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
          this.zoom = 16;

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
            this.listaObrasBack = data;
            this.listaObras = data;
            console.log(data);
            resolve();
          })

        });
      }
    })
  }

  private setCurrentLocation2() {
    return new Promise<void>((resolve) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
          this.lat2 = position.coords.latitude;
          this.lng2 = position.coords.longitude;
          resolve();
        });
      }
    })
  }

  openMap(event) {
    console.log(event);
    if (this.platform.is('desktop')) {
      window.open('https://www.google.com/maps?q=' + event.lat_obra + ',' + event.lon_obra);
    }
    else if (this.platform.is('android')) {
      window.open('geo:0,0?q=' + event.lat_obra + ',' + event.lon_obra + '(' + event.nombre_obra + ')', '_system');
    }


  }

  openNewObra() {
    let navigationExtras: NavigationExtras = {
      replaceUrl: true,
      state: {
        step: 10
      }
    };
    
    this.router.navigate(['/add-visita'], navigationExtras);
  }

  regVisita(event) {
    let navigationExtras: NavigationExtras = {
      replaceUrl: true,
      state: {
        step: 20,
        obra: event
      }
    };
    
    this.router.navigate(['/add-visita'], navigationExtras);
  }

  async regSeguimiento(event) {
    console.log(event)
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
      componentProps: { 
        event: event
      }
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      //despues de cerrar modal
    });
  }
}




