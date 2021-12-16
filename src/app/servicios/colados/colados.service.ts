import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ColadosService {

  constructor(
    private afs: AngularFirestore,
    ) { }


    getColadosAll() {
      return this.afs.collection('smaug').doc('totalconcretos').collection('calendarioColados', ref =>
        ref
          .orderBy('f_creado')
      ).snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          let evento = 
            {
              title: '('+data['nombre_vendedor']+') '+data['cliente']+' '+data['mts_concreto']+' m2 '+data['formula']+' '+data['tipo_entrega'],
              startTime: new Date (data['fecha']+' '+data['hora_inicio']),
              endTime: new Date (data['fecha']+' '+data['hora_fin']),
              allDay: false,
              desc: 'Desc del evento',
              detEvent:data
            };
            console.log(evento);
          return evento;
        })));
    }
}
