import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from './../../servicios/auth/auth.service';
import { ObrasService } from './../../servicios/obras/obras.service';
import { Router, NavigationExtras } from '@angular/router';
import { MenuController, ModalController } from '@ionic/angular';
import { Observable, Subscription } from 'rxjs';
import { ModSelCliPage } from 'src/app/obras/mod-sel-cli/mod-sel-cli.page';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-obras-tab',
  templateUrl: './obras-tab.component.html',
  styleUrls: ['./obras-tab.component.scss'],
})
export class ObrasTabComponent implements OnInit, OnDestroy {

  done: boolean = false;

  subscription: Subscription;

  dataObras = [];
  public columns: any;
  public rows = [];
  temp = [];

  errorSinObras:boolean=false;

  @Input() filtroVendedor: boolean = false;

  @Input() origen: string = 'obra';
  @Input() filtros: Observable<any>;
  @Input() detCliente: any = null;

  @Output() selectObra: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private obrasService: ObrasService,
    public auth: AuthService,
    private router: Router,
    public modalController: ModalController,
    private menu: MenuController,
    private cd: ChangeDetectorRef
  ) {

  }

  ngOnInit() {
    this.getDataObras();
    if (this.filtros) {
      this.filtros.subscribe(data => {
        this.updateFilter2(data);
        this.cd.markForCheck();
      });
    }

  }

  updateFilter2(filtrosData: any) {
    let dataFilter = []
    if (filtrosData['obras'] == 'propias') dataFilter = this.temp.filter(o => o.currentVendedor == this.auth.dataUser['idNumerico'])
    else if (filtrosData['obras'] == 'todas') dataFilter = this.temp;
    
    if(filtrosData['textFilter'] !== ''){
      const val = filtrosData['textFilter'].toLowerCase();

      // filter our data
      dataFilter = dataFilter.filter(function (d) {
        if (d.nombre_obra) return d.nombre_obra.toLowerCase().indexOf(val) !== -1 || !val;
      });
    }
    this.rows = dataFilter;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  async goToAsingCliente(obra: any) {

    const modal = await this.modalController.create({
      component: ModSelCliPage,
      cssClass: 'cal-modal',
      backdropDismiss: false
    });

    await modal.present();

    modal.onDidDismiss().then((result) => {

      if (result['data']) {
        Swal.fire({
          title: "Registrando Obra",
          text: "La información se esta subiendo al sistema",
          showCloseButton: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          showConfirmButton: false,
        });

        let detCli = result['data']['detCli'];
        let post = { idCli: detCli['id'], nombreCli: detCli['nombre_cli'] }
        post['user_mod'] = this.auth.currentUserId;
        post['f_modificado'] = new Date();
        post['idSistema'] = obra.idSistema;
        post['id'] = obra.id;
        this.obrasService.updateObra(post).then((data) => {
          Swal.close();
          Swal.fire({
            title: "Obra modificada",
            text: "La obra ha sido modificado correctamente.",
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then(() => {

          });
        });
      }
    });
  }

  async getDataObras() {

    this.subscription = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;

        await this.auth.getUserData();
        this.dataObras = [];
        await new Promise<void>((resolve) => {

          if (this.detCliente) {
            this.subscription = this.obrasService.getListObrasCli(this.detCliente.id).subscribe(data => {
              this.dataObras = data;

              this.dataObras.sort(function (a, b) {
                return new Date(b.f_creado.seconds * 1000).getTime() - new Date(a.f_creado.seconds * 1000).getTime();
              });
              this.rows = this.dataObras;
              this.temp = this.rows;
              resolve();
            })
          } else {
            this.obrasService.getListObrasAll().subscribe(async data => {
              this.dataObras = data;
              
              if (this.filtroVendedor) {
                this.dataObras = this.dataObras.filter(o => o.currentVendedor == this.auth.dataUser['idNumerico']);
              }

              this.dataObras.sort(function (a, b) {
                return new Date(b.f_creado.seconds * 1000).getTime() - new Date(a.f_creado.seconds * 1000).getTime();
              });
              this.rows = this.dataObras;
              if(this.origen=='visita' && this.rows.filter(o=>o.estatus == 'activa' || o.estatus == 'seguimiento').length==0) {
                this.errorSinObras=true;
              }
              this.temp = this.rows;
              resolve();
            })
          }
        })
        this.done = true;
      }
    });
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

  changeSelectObra(post: any) {
    let detObra = post;
    this.selectObra.emit({ detObra: detObra });
  }

}
