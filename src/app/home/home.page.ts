import { Component,OnDestroy } from '@angular/core';
import { AuthService } from "./../servicios/auth/auth.service";
import { MenuController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnDestroy {

  subscriptios: Subscription;  

  constructor(private auth: AuthService,
    private menuCtrl: MenuController
  ) {
    console.log('constructor');
  }
  ngOnDestroy(): void {
    this.subscriptios.unsubscribe();
  }

  async ngOnInit() {
    this.subscriptios=this.auth.userDetails().subscribe(async user => {
      console.log('user', user);
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();

        if (this.auth.dataUser['role'].length == 1) {
          this.menuCtrl.enable(true,'principal');
          this.auth.currentRole = this.auth.dataUser['role'][0];
          localStorage.setItem('role', JSON.stringify(this.auth.dataUser['role'][0]));
          localStorage.setItem('dataUser', JSON.stringify(this.auth.dataUser));
        }
        else {
          console.log('preguntar')
          this.menuCtrl.enable(true,'principal');
        }
      } else {
        console.log('sin loguear')
      }
    }, err => {
      console.log('err', err);
    })

  }


  async ionViewWillEnter() {

  }

}
