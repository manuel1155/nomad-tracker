import { Component, ViewChild, OnInit, Inject, LOCALE_ID } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { CalendarComponent } from "ionic2-calendar";
import { ObrasService } from '../servicios/obras/obras.service';
import { AuthService } from '../servicios/auth/auth.service';
import { Subscription } from 'rxjs';
import { ColadosService } from '../servicios/colados/colados.service';

@Component({
  selector: 'app-calendario-colados',
  templateUrl: './calendario-colados.page.html',
  styleUrls: ['./calendario-colados.page.scss'],
})
export class CalendarioColadosPage implements OnInit {

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
    private coladosServ: ColadosService
  ) {}

  ngOnInit() {

    this.coladosServ.getColadosAll().subscribe(data=>{
      this.eventSource=data;
    })

  }

  next() {
    this.myCal.slideNext();
  }

  back() {
    this.myCal.slidePrev();
  }

  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

}
