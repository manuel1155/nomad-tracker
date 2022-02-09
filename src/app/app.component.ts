import { Component } from '@angular/core';
import { Platform, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private _location: Location,
    public alertController: AlertController,
    private navCtrl: NavController
  ) {
    this.initializeApp();
    this.platform.backButton.subscribeWithPriority(10, (processNextHandler) => {
      console.log('Back press handler!');
      if (this._location.isCurrentPathEqualTo('/reg-seguimiento')) {
        this.showExitConfirm();
        processNextHandler();
      } else {

        // Navigate to back page
        console.log('Navigate to back page');
        this._location.back();

      }

    });

    this.platform.backButton.subscribeWithPriority(5, () => {
      console.log('Handler called to force close!');
      this.alertController.getTop().then(r => {
        if (r) {
          navigator['app'].exitApp();
        }
      }).catch(e => {
        console.log(e);
      })
    });

  }

  showExitConfirm() {
    this.alertController.create({
      header: 'Salir de Seguimiento',
      message: 'Si te sales del seguimiento no se estarán mandando los datos. ¿Deseas salir?',
      backdropDismiss: false,
      buttons: [{
        text: 'Cancelar',
        role: 'cancel',
        handler: () => {
          console.log('Application exit prevented!');
        }
      }, {
        text: 'Salir',
        handler: () => {
          this.navCtrl.navigateBack('/home');
          //this._location
        }
      }]
    })
      .then(alert => {
        alert.present();
      });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

}
