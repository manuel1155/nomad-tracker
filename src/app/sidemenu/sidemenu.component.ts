import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from './../servicios/auth/auth.service';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-sidemenu',
  templateUrl: './sidemenu.component.html',
  styleUrls: ['./sidemenu.component.scss'],
})
export class SidemenuComponent implements OnInit {

  isLoggedin: boolean = false;

  currentPageTitle = 'Home';

  paginas = [
    {
      title: 'Inicio',
      url: '/home',
      icon: 'home'
    },{
      title: 'Mis Seguimientos',
      url: '/seguimientos-list',
      icon: 'clipboard'
    }

  ];

  
  constructor(private auth: AuthService,
    public router: Router,
    private menuCtrl: MenuController) { }

  ngOnInit() {
    
    this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();
      } else {
        console.log('sin loguear sidemenu')
      }
    }, err => {
      console.log('err', err);
    })
  }

  async logoutApp() {
    if (await this.menuCtrl.isOpen()) {
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('dataUser');
      this.menuCtrl.close();
      this.auth.signOut();
    }
  }

  async goToPage(url: string) {
    if (await this.menuCtrl.isOpen()) {
      await this.menuCtrl.close().then(() => {
        this.router.navigate([url]);
      });
    }
  }


  isLoggedIn() {
    this.isLoggedin = this.auth.isLoggedIn;
    if (this.auth.isLoggedIn) return true;
    else return false;
  }


}
