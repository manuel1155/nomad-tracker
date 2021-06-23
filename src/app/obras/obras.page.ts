import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';


@Component({
  selector: 'app-obras',
  templateUrl: './obras.page.html',
  styleUrls: ['./obras.page.scss'],
})
export class ObrasPage implements OnInit {

  currentCli: any = null;
  @ViewChild('tabObras', { static: false }) tabObras;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {
    console.log('constructor obras')
    if (this.router.getCurrentNavigation() != null) {
      this.route.queryParams.subscribe(async params => {
        console.log(this.router);
        if (this.router.getCurrentNavigation().extras.state) {
          console.log('con parametros ObrasPage')
          this.currentCli = this.router.getCurrentNavigation().extras.state.detCli;
        } else {
          console.log('sin parametros origen cliente ObrasPage')
          this.currentCli = null;
        }
      });
    } else {
      console.log('sin parametros origen modal ObrasPage')
      this.currentCli = null;
    }
  }

  ngOnInit() {
    console.log('obrasPage ngOnInit')
  }

  goToAddObra(detCli: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        detCli: detCli,
        lat: null,
        lon: null
      }
    };
    console.log(detCli);
    this.router.navigate(['/add-obra'], navigationExtras);
  }

  backClientes() {
    this.router.navigate(['/clientes']);
  }

  ionViewWillEnter() {
    // your initialization goes here
    console.log('ionViewWillEnter obrasPage')
    this.tabObras.ngOnInit();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave obrasPage')
    if (this.tabObras) {
      this.tabObras.ngOnDestroy();
    }
  }
}
