import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProspectoService {

  constructor(
    private afs: AngularFirestore,
    private datePipe: DatePipe
  ) { }

  async createProspecto(post:any) {
    return new Promise((resolve) => {     
      post['idSistema'] = post['id'].substring(0, 5).toUpperCase();
      console.log(post);
      this.afs.collection('smaug/ecogarmoncfe/usuarios/' + post['user_reg'] + '/ubicaciones_cambaceo').add({
        f_registro: new Date(),
        user_reg: post['user_reg'],
        ubicacion: post['ubicacion'],
        idProspecto: post['id']
      }).then(() => {
        this.afs.doc('smaug/ecogarmoncfe/prosp_cambaceo/' + post['id']).set(post).then(() => {
          resolve({ success: true, idSistema: post['idSistema'] })
        });
      });
    });
  }

  updateProsp(post:any) {
    return new Promise((resolve) => {
      this.afs.doc('smaug/ecogarmoncfe/prosp_cambaceo/' + post['id']).update(post).then(() => {
        resolve({ success: true, idSistema: post['idSistema'] })
      }).catch(() => {
        resolve('error');
      });
    })
  }

  getListProspectosDia(idVendedor: string) {
    let hoy = new Date();

    let fechaString = this.datePipe.transform(hoy, 'yyyy-MM-dd');
    let inicioDia = this.datePipe.transform(new Date(fechaString + ' 00:01'), 'yyyy-MM-dd HH:mm');
    let finDia = this.datePipe.transform(new Date(fechaString + ' 23:59'), 'yyyy-MM-dd HH:mm');

    let iDia = new Date(inicioDia);
    let fDia = new Date(finDia);
    console.log('consulta del dia '+iDia);
    return this.afs.collection('smaug').doc('ecogarmoncfe').collection('prosp_cambaceo', ref =>
      ref
        .where('user_reg', '==', idVendedor)
        .orderBy('f_modificado')
        .startAt(new Date(iDia))
        .endAt(new Date(fDia))
    ).valueChanges();
  }

  getListProspectosInc(idVendedor: string) {
    let hoy = new Date();
    hoy.setDate(hoy.getDate() - 1);

    let fechaString = this.datePipe.transform(hoy, 'yyyy-MM-dd');
    let finDia = this.datePipe.transform(new Date(fechaString + ' 23:59'), 'yyyy-MM-dd HH:mm');
    let fDia = new Date(finDia);

    console.log('consulta incompletos '+fDia);
    return this.afs.collection('smaug').doc('ecogarmoncfe').collection('prosp_cambaceo', ref =>
      ref
        .where('user_reg', '==', idVendedor)
        .where('estatus', '==', 'incompleto')
        .orderBy('f_modificado')
        .endAt(fDia)
    ).valueChanges();
  }
}
