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
    if (this.router.getCurrentNavigation() != null) {
      this.route.queryParams.subscribe(async params => {
        if (this.router.getCurrentNavigation().extras.state) {
          this.currentCli = this.router.getCurrentNavigation().extras.state.detCli;
        } else {
          this.currentCli = null;
        }
      });
    } else {
      this.currentCli = null;
    }
  }

  ngOnInit() {
  }

  goToAddObra() {
    let navigationExtras: NavigationExtras = {
      state: {
        detCliente: this.currentCli,
        lat: null,
        lon: null
      }
    };
    this.router.navigate(['/add-obra-mod'], navigationExtras);
  }

  backClientes() {
    this.router.navigate(['/clientes']);
  }

  ionViewWillEnter() {
    // your initialization goes here
    this.tabObras.ngOnInit();
  }

  ionViewWillLeave() {
    if (this.tabObras) {
      this.tabObras.ngOnDestroy();
    }
  }
}
