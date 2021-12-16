import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getCounterUsers() {
    return new Promise((resolve) => {
      this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc('counter').valueChanges().pipe(take(1)).subscribe(async  y => {
        resolve(y['counter']);
      });
    });
  }

  setCounterUsers(cant: number) {
    return new Promise<void>((resolve) => {
      this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc('counter').update({ counter: cant }).then(() => {
        resolve();
      })
    })
  }

  async createUser(post) {
    let id = this.afs.createId();
    post['id'] = id;
    return new Promise<void>(resolve => {
      this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc(post['id']).set(post).then(
        (success) => {
          resolve()
        },
        (err) => console.warn(err)
      )
    });
  }

  getListUsers() {
    return this.afs.collection('app-covid').doc('selacademy').collection('usuarios').snapshotChanges();
  }

  updateUser(idUser, post) {
    this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc(idUser).update(post);
  }

  deleteUser(idUser) {
    this.afs.collection('app-covid').doc('selacademy').collection('usuarios').doc(idUser).delete();
  }
}
