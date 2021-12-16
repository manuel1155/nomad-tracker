import { DatePipe } from '@angular/common';
import { Component, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from 'src/app/servicios/auth/auth.service';
import { ObrasService } from 'src/app/servicios/obras/obras.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit-hora',
  templateUrl: './edit-hora.page.html',
  styleUrls: ['./edit-hora.page.scss'],
})
export class EditHoraPage implements AfterViewInit {

  modalReady = false;
  
  currentDate = '';
  currentHora = '';
  
  event: any = null;

  constructor(
    private modalCtrl: ModalController,
    private auth: AuthService,
    private obrasServ: ObrasService,
    private datePipe: DatePipe
  ) {

   }

  ngAfterViewInit(): void {
    setTimeout(() => {
      let f_seg = this.event.f_seguimiento.toDate();

      this.currentDate=this.datePipe.transform(f_seg, 'yyyy-MM-dd');
      this.currentHora=this.datePipe.transform(f_seg, 'HH:mm');

      this.modalReady = true;
    }, 0);
  }

  modificarHora(){

    let post={
      id:this.event.id,
      f_seguimiento: new Date(this.currentDate +' '+this.currentHora)
    };

    this.obrasServ.updateObra(post).then((data) => {
      Swal.close();
      Swal.fire({
        title: "Hora actualizada",
        text: "La hora del seguimiento ha sido modificada correctamente",
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        this.close();
      });
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
