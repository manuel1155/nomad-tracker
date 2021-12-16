import { Component, AfterViewInit,ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-mod-sel-cli',
  templateUrl: './mod-sel-cli.page.html',
  styleUrls: ['./mod-sel-cli.page.scss'],
})
export class ModSelCliPage implements AfterViewInit {

  @ViewChild('tabClientes', { static: false }) tabClientes;
  modalReady = false;
  SelCliente:any=null;

  constructor(private modalCtrl: ModalController) { }
 
  ngAfterViewInit() {
    setTimeout(() => {
      this.modalReady = true;      
    }, 0);
  }

  close() {
    this.modalCtrl.dismiss();
  }

  save() {    
    this.modalCtrl.dismiss({detCli: this.SelCliente})
  }

  verCliente(event: any){
    this.SelCliente=event.detCliente;
  }

}
