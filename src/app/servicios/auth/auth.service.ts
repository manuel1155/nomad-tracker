import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from "@angular/router";
import { Observable, Subject, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  currentUser: User;
  dataUser: any;
  userProviderAdditionalInfo: any;
  redirectResult: Subject<any> = new Subject<any>();
  currentRole:string;

  userDetails() {
    return this.afAuth.user
  }
  
  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {
    this.afAuth.onAuthStateChanged(async (user) => {
      if (user!=null) {
        this.currentUser = user;
        await this.getUserData();     
        //this.router.navigate(['/pages']);    
      } else {
        
      }
    })

    /*
    this.afAuth.onAuthStateChanged(async (user) => {
      console.log(user);
      if (user) {
        // User is signed in.
        this.currentUser = user;
        let userInfo={
          uid:user.uid,
          email:user.email
        }
        localStorage.setItem('user', JSON.stringify(userInfo));
        JSON.parse(localStorage.getItem('user'));
        await this.getUserData();
      } else {
        // No user is signed in.
        localStorage.setItem('user', null);
        JSON.parse(localStorage.getItem('user'));
        this.currentUser = null;
      }
    });
    // when using signInWithRedirect, this listens for the redirect results
    this.afAuth.getRedirectResult()
      .then((result) => {
        // result.credential.accessToken gives you the Provider Access Token. You can use it to access the Provider API.
        if (result.user) {
          this.setProviderAdditionalInfo(result.additionalUserInfo.profile);
          this.currentUser = result.user;
          this.redirectResult.next(result);
        }
      }, (error) => {
        this.redirectResult.next({ error: error.code });
      });
*/
  }
/*
  getRedirectResult(): Observable<any> {
    return this.redirectResult.asObservable();
  }

  setProviderAdditionalInfo(additionalInfo: any) {
    this.userProviderAdditionalInfo = { ...additionalInfo };
  }
*/
 
  async getUserData() {
    return new Promise(resolve => {
        this.afs.doc('smaug/totalconcretos/usuarios/' + this.currentUserId).valueChanges().subscribe(data => {
          if(data){
            this.dataUser = data;
            resolve('success');
          }else{
            this.signOut();
            resolve('error');
          }
        });
    });
  }

  get isLoggedIn(): boolean {
    return this.currentUser !== undefined;
  }

  get currentUserId(): string {
    return this.isLoggedIn ? this.currentUser.uid : '';
  }

  getLoggedInUser() {
    return this.currentUser;
  }

  signOut(): Observable<any> {
    return from(this.afAuth.signOut().then(() => {
      this.router.navigate(['login'], { replaceUrl: true });
    }));
  }

  signInWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  signUpWithEmail(email: string, password: string): Promise<auth.UserCredential> {
    return this.afAuth.createUserWithEmailAndPassword(email, password);
  }
}

export class ProfileModel {
  image: string;
  name: string;
  role: string;
  description: string;
  email: string;
  provider: string;
  phoneNumber: string;
}