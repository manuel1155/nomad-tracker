import { Component, Input, OnInit, ViewChild, Output, EventEmitter,OnDestroy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from './../../servicios/auth/auth.service';
import { ObrasService } from './../../servicios/obras/obras.service';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-obras-tab',
  templateUrl: './obras-tab.component.html',
  styleUrls: ['./obras-tab.component.scss'],
})
export class ObrasTabComponent implements OnInit,OnDestroy {

  done: boolean = false;

  subscription: Subscription;
  
  dataObras = [];
  public columns: any;
  public rows = [];
  temp = [];

  @Input() origen: string = 'obra';
  @Input() detCliente: any = null;
  @ViewChild(DatatableComponent) Filtro1: DatatableComponent;
  @Output() selectObra: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private obrasService: ObrasService,
    public auth: AuthService,
    private router: Router,
    public modalController: ModalController
  ) {
   }

  ngOnInit() {
    this.getDataObras();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async getDataObras() {

    this.subscription = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();
        this.dataObras = [];
        await new Promise<void>((resolve) => {

          if(this.detCliente){
            this.subscription = this.obrasService.getListObrasCli(this.detCliente.id).subscribe(data => {
              this.dataObras = data;
              this.dataObras.sort(function (a, b) {
                return new Date(b.f_creado.seconds * 1000).getTime() - new Date(a.f_creado.seconds * 1000).getTime();
              });
              this.rows = this.dataObras;
              this.temp = this.rows;
              resolve();
            })
          }else{
            this.obrasService.getListObrasAll().subscribe(data => {
              this.dataObras = data;
              this.dataObras.sort(function (a, b) {
                return new Date(b.f_creado.seconds * 1000).getTime() - new Date(a.f_creado.seconds * 1000).getTime();
              });
              this.rows = this.dataObras;
              this.temp = this.rows;
              resolve();
            })
          }
        })
        this.done = true;
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.nombre_obra) return d.nombre_obra.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.Filtro1.offset = 0;
  }

  goToAddObra() {
    this.router.navigate(['/add-obra-mod']);
  }

  goToEditObra(detObra: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        detObra: detObra,
        detCliente: this.detCliente
      }
    };
    this.router.navigate(['/add-obra-mod'], navigationExtras);
  }
}
