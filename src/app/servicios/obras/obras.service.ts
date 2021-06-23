import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObrasService {

  constructor(
    private afs: AngularFirestore,
    private datePipe: DatePipe
  ) { }

  async createObra(post: any) {
    let id = this.afs.createId();
    post['id'] = id;
    post['user_mod'] = '';
    post['user_ter'] = '';
    post['f_creado'] = new Date();
    post['f_modificado'] = new Date();
    post['f_termiado'] = '';

    console.log(post);
    await new Promise<void>((resolve) => {
      this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + post['idCli']).valueChanges().pipe(take(1)).subscribe(cli=>{
        let obras=cli['obras']+1;
        this.afs.doc('smaug/totalconcretos/clientes_cambaceo/' + post['idCli']).update({obras:obras}).then(()=>{
          resolve();
        })
      })
    });

    return new Promise((resolve) => {
      post['idSistema'] = post['id'].substring(0, 6).toUpperCase();
      console.log(post);
      this.afs.doc('smaug/totalconcretos/obras_cambaceo/' + post['id']).set(post).then(() => {
        resolve({ success: true, idSistema: post['idSistema'] })
      });
    })
  }

  updateObra(post: any) {
    return new Promise((resolve) => {
      this.afs.doc('smaug/totalconcretos/obras_cambaceo/' + post['id']).update(post).then(() => {
        resolve({ success: true, idSistema: post['idSistema'] })
      }).catch(() => {
        resolve('error');
      });
    })
  }

  getListObrasAll() {
    return this.afs.collection('smaug').doc('totalconcretos').collection('obras_cambaceo').valueChanges();
  }

  getListObrasCli(idCli: string) {
    return this.afs.collection('smaug').doc('totalconcretos').collection('obras_cambaceo', ref =>
      ref
        .where('idCli', '==', idCli)
    ).valueChanges();
  }
}
