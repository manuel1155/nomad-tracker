import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TrackerService {

  constructor(
    private afs: AngularFirestore,
    public auth: AuthService
  ) {

   }

   getTrackersTransp(){
     console.log(this.auth.currentUserId)
    return this.afs.collection('smaug/nomadtracker/tracker', ref =>
        ref
          .where('idTransportista', '==', this.auth.currentUserId)
          .where('estatus','==','creado')
          .orderBy('f_registro')
      ).valueChanges();
  }

  regCoordTracker(id,arrayPos){
    this.afs.doc('smaug/nomadtracker/tracker'+id).update({
      seguimiento:arrayPos
    })
  }

}
