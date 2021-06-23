import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
})
export class ClientesPage implements OnInit {

  @ViewChild('tabClientes', { static: false }) tabClientes;

  constructor(private router: Router) { }
 
  ngOnInit() {
    console.log('clientesPage ngOnInit')
  }

  goToAddCliente(){
    this.router.navigate(['/add-cliente']);
  }

  ionViewWillEnter() {
    // your initialization goes here
    console.log('ionViewWillEnter clientesPage')
    this.tabClientes.ngOnInit();
  }

  ionViewWillLeave() {
    console.log('ionViewWillLeave clientesPage')
    if (this.tabClientes) {
      this.tabClientes.ngOnDestroy();
    }
  }
}
