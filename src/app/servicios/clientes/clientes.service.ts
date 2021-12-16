import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {

  constructor(
    private afs: AngularFirestore
  ) { }

  async createCliente(post: any) {
    let id = this.afs.createId();
    post['id'] = id;
    post['user_mod'] = '';
    post['user_ter'] = '';
    post['f_creado'] = new Date();
    post['f_modificado'] = new Date();
    post['f_termiado'] = '';
    post['obras'] = 0;

    return new Promise((resolve) => {
      post['idSistema'] = post['id'].substring(0, 6).toUpperCase();
      this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + post['id']).set(post).then(() => {
        resolve({ success: true, idSistema: post['idSistema'] })
      });
    })
  }

  updateCliente(post: any) {
    return new Promise((resolve) => {
      this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + post['id']).update(post).then(() => {
        resolve({ success: true, idSistema: post['idSistema'] })
      }).catch(() => {
        resolve('error');
      });
    })
  }

  getListClientes() {
    return this.afs.collection('smaug').doc('totalconcretos').collection('clientes_cambaceo').valueChanges();
  }

  async setAddObra(idCli: string) {
    return new Promise((resolve) => {
      this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + idCli).valueChanges().pipe(take(1)).subscribe(cli => {
        let obras = cli['obras'] + 1;
        this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + idCli).update({ obras: obras }).then(() => {
          resolve({ success: true });
        })
      })
    });
  }
}
