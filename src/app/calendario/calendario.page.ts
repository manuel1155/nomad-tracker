
import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalModalPage } from './cal-modal/cal-modal.page';
import { CalendarComponent } from "ionic2-calendar";
import { ObrasService } from '../servicios/obras/obras.service';
import { AuthService } from '../servicios/auth/auth.service';
import { Subscription } from 'rxjs';
import { EditHoraPage } from './edit-hora/edit-hora.page';
 
@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.page.html',
  styleUrls: ['./calendario.page.scss'],
})
export class CalendarioPage implements OnInit {

  eventSource = [];
  viewTitle: string;

  subscriptios: Subscription; 
 
  calendar = {
    mode: 'month',
    currentDate: new Date(),
    locale: 'es-MX'
  };
 
  selectedDate: Date;
 
  @ViewChild(CalendarComponent, null) myCal:CalendarComponent;

  constructor(
    @Inject(LOCALE_ID) private locale: string,
    private modalCtrl: ModalController,
    private obrasServ: ObrasService,
    private auth: AuthService,
  ) {}
 
  ngOnInit() {
    this.obrasServ.getListObrasSegVend(this.auth.dataUser['idNumerico']).subscribe(data=>{
      var events = [];

      for(let event of data){
        let f_seg_ini = new Date (event['f_seguimiento'].toDate());
        let f_seg_fin =new Date(f_seg_ini.getTime() + 30*60000);

        events.push({
          title: event['nombre_obra'],
          startTime: f_seg_ini,
          endTime: f_seg_fin,
          allDay: false,
          desc: 'Clinte: '+event['nombreCli']+ ' Tipo Obra:'+event['tipo_obra'],
          detEvent:event
        });
      }

      this.eventSource=events;

    })
  }
 
  // Change current month/week/day
  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }
 
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
 
  // Calendar event was clicked
  async onEventSelected(event) {
    this.openCalModal(event);
    /*
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
 
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'Desde: ' + start + '<br><br>Hasta: ' + end,
      buttons: ['OK'],
    });
    alert.present();*/
  }
 
   async openCalModal(event) {
    const modal = await this.modalCtrl.create({
      component: CalModalPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
      componentProps: { 
        event: event.detEvent
      }
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      //despues de cerrar modal
    });
  }


  async modHora(datos:any){
    const modal = await this.modalCtrl.create({
      component: EditHoraPage,
      cssClass: 'cal-modal',
      backdropDismiss: false,
      componentProps: { 
        event: datos
      }
    });
   
    await modal.present();
   
    modal.onDidDismiss().then((result) => {
      //despues de cerrar modal
    });
  }


}
