import { Component, Input, OnInit, ViewChild, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { AuthService } from './../../servicios/auth/auth.service';
import { ClientesService } from './../../servicios/clientes/clientes.service';
import { Subscription } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { AddClientePage } from 'src/app/add-cliente/add-cliente.page';

@Component({
  selector: 'app-clientes-tab',
  templateUrl: './clientes-tab.component.html',
  styleUrls: ['./clientes-tab.component.scss'],
})


export class ClientesTabComponent implements OnInit,OnDestroy {

  done: boolean = false;
  subscriptios: Subscription;
  dataClientes = [];
  public columns: any;
  public rows = [];
  temp = [];

  @Input() origen: string = 'cliente';
  @ViewChild(DatatableComponent) Filtro1: DatatableComponent;
  @Output() selectCli: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private cliService: ClientesService,
    public auth: AuthService,
    private router: Router,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    console.log(this.origen);
    console.log('init clientes-tab componente');
    this.getDataClientes();
  }

  ngOnDestroy(): void {
    console.log('destroy clientes-tab componente')
    this.subscriptios.unsubscribe();
  }

  async getDataClientes() {

    this.subscriptios = this.auth.userDetails().subscribe(async user => {
      if (user !== null) {
        this.auth.currentUser = user;
        await this.auth.getUserData();
        this.dataClientes = [];
        await new Promise<void>((resolve) => {
          this.cliService.getListClientes().subscribe(data => {
            console.log(data);
            this.dataClientes = data;
            this.dataClientes.sort(function (a, b) {
              return new Date(b.f_creado.seconds * 1000).getTime() - new Date(a.f_creado.seconds * 1000).getTime();
            });
            this.rows = this.dataClientes;
            this.temp = this.rows;
            resolve();
          })
        })
        this.done = true;
      }
    });
  }

  updateFilter(event) {
    const val = event.target.value.toLowerCase();

    // filter our data
    const temp = this.temp.filter(function (d) {
      if (d.nombre_cli) return d.nombre_cli.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.Filtro1.offset = 0;
  }

  goToAddCliente() {
    this.router.navigate(['/add-cliente']);
  }

  goToEditCli(cli: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        prosp: cli
      }
    };
    console.log(cli);
    this.router.navigate(['/add-cliente'], navigationExtras);
  }

  goToObras(detCli: any) {
    let navigationExtras: NavigationExtras = {
      state: {
        detCli: detCli
      }
    };
    console.log(detCli);
    this.router.navigate(['/obras'], navigationExtras);
  }

  selectCliente(post: any) {
    console.log(post);
    let detCliente = {
      id: post['id'],
      idSistema: post['idSistema'],
      name_cont_admin_cli: post['name_cont_admin_cli'],
      nombre_cli: post['nombre_cli'],
      num_cont_admin_cli: post['num_cont_admin_cli'],
      rfc_cli: post['rfc_cli']
    }

    this.selectCli.emit({ idCli: post['id'], detCliente: detCliente });
  }

  async addClienteModal() {
    console.log('clic open modal');
    const modal = await this.modalController.create({
      component: AddClientePage,
      cssClass: 'my-custom-class',
      componentProps: {
        'origen': 'modal'
      }
    });

    modal.onDidDismiss().then((detail) => {
      if (detail !== null) {
        console.log('The result:', detail.data);
      }
    });
    return await modal.present();
  }

}
