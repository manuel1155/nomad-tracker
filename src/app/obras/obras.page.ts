import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


@Component({
  selector: 'app-obras',
  templateUrl: './obras.page.html',
  styleUrls: ['./obras.page.scss'],
})
export class ObrasPage implements OnInit {

  currentCli: any = null;
  @ViewChild('tabObras', { static: false }) tabObras;

  dataFiltros: any = null;
  formFiltros: FormGroup;
  textFilter: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menu: MenuController,
    private fb: FormBuilder,
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

    this.formFiltros = this.fb.group({
      obras: ['todas', Validators.required],
      cliente: 'todos',
      estatus: ''
    });
  }

  ngOnInit() {

    this.dataFiltros = new BehaviorSubject({
      obras: 'todas',
      textFilter: '',
    });

    this.onChangeFilter();

  }

  updateFilter(text) {
    console.log(text);
    this.textFilter=text;
    console.log(this.textFilter)
    let dataFiltros = this.formFiltros.value;
    dataFiltros['textFilter'] = this.textFilter
    this.dataFiltros.next(dataFiltros);
  }

  onChangeFilter() {
    this.formFiltros.valueChanges.subscribe(data => {
      let dataFiltros = data;
      dataFiltros['textFilter'] = this.textFilter
      this.dataFiltros.next(dataFiltros);
    })
  }

  changeName() {

    this.dataFiltros.next({
      firstname: 'Foo',
      lastname: 'Kooper'

    });
  }

  openFiltros() {
    this.menu.enable(true, 'filtros');
    this.menu.open('filtros');
  }

  closeFiltros() {
    this.menu.enable(false, 'filtros')
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
