import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from './../servicios/auth/auth.service';
import { Subscription } from 'rxjs';
import { ProspectoService } from '../servicios/prospecto/prospecto.service';
import { Router, NavigationExtras } from '@angular/router';
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-prospectos-list',
  templateUrl: './prospectos-list.page.html',
  styleUrls: ['./prospectos-list.page.scss'],
})
export class ProspectosListPage implements OnInit {

  currentGrupo: any;
  dataProspectos = [];
  dataProspAnt = [];
  dataProspHoy = []
  public columns: any;
  public rows = [];
  temp = [];
  done: boolean = false;
  subscriptios: Subscription;

  @ViewChild(DatatableComponent) Filtro1: DatatableComponent;

  constructor(
    private prospService: ProspectoService,
    public auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    //this.getDataProspectos();
    console.log('on init');
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if(d.nombre_prosp) return d.nombre_prosp.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.Filtro1.offset = 0;
  }

  async ionViewWillEnter() {
    console.log('ionViewWillEnter');
    this.dataProspectos = [];
    this.getDataProspectos();
  }

  async getDataProspectos() {

    this.subscriptios = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;

        await this.auth.getUserData();

        this.dataProspectos = [];

        await new Promise<void>((resolve) => {
          this.prospService.getListProspectosDia(this.auth.currentUserId).subscribe(data => {
            console.log(data);
            this.dataProspHoy = data;
            this.dataProspectos = [...this.dataProspAnt, ...this.dataProspHoy];
            this.dataProspectos.sort(function (a, b) {
              return new Date(b.f_modificado.seconds * 1000).getTime() - new Date(a.f_modificado.seconds * 1000).getTime();
            });
            this.rows=this.dataProspectos
            resolve();
          })
        })

        await new Promise<void>((resolve) => {
          this.prospService.getListProspectosInc(this.auth.currentUserId).subscribe(data => {
            console.log(data);
            this.dataProspAnt = data;
            this.dataProspectos = [...this.dataProspAnt, ...this.dataProspHoy];
            this.dataProspectos.sort(function (a, b) {
              return new Date(b.f_modificado.seconds * 1000).getTime() - new Date(a.f_modificado.seconds * 1000).getTime();
            });
            this.rows=this.dataProspectos
            resolve();
          })
        })

        this.temp = this.rows;
        this.done = true;
      }
    });
  }

  goToEdit(prosp: any) {

    let navigationExtras: NavigationExtras = {
      state: {
        prosp: prosp
      }
    };
    console.log(prosp);
    this.router.navigate(['/reg-prosp-ini'], navigationExtras);
  }

}
