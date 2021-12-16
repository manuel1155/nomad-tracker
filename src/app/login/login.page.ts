import { Component,NgZone,OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from "./../servicios/auth/auth.service";
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MenuController} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  signInForm: FormGroup;
  submitError: string;

  validation_messages = {
    'email': [
      { type: 'required', message: 'El correo electrónico es requerido.' },
      { type: 'pattern', message: 'Ingresa un correo electrónico valido.' }
    ],
    'password': [
      { type: 'required', message: 'La contraseña es requerido.' },
      { type: 'minlength', message: 'La contraseña debe contener mínimo 6 caracteres.' }
    ]
  };

  constructor(public auth: AuthService,
    public router: Router,
    public angularFire: AngularFireAuth,
    private ngZone: NgZone,
    private menuCtrl: MenuController
    ) {
      this.signInForm = new FormGroup({
        'email': new FormControl('', Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
        ])),
        'password': new FormControl('', Validators.compose([
          Validators.minLength(6),
          Validators.required
        ]))
      }); 
      
      // Get firebase authentication redirect result invoken when using signInWithRedirect()
      // signInWithRedirect() is only used when client is in web but not desktop
    }

    ngOnInit(){
      this.menuCtrl.enable(false, 'principal');
    }

    async redirectLoggedUserToProfilePage() {
      // As we are calling the Angular router navigation inside a subscribe method, the navigation will be triggered outside Angular zone.
      // That's why we need to wrap the router navigation call inside an ngZone wrapper
      await this.auth.getUserData();
      this.ngZone.run(() => {
        this.router.navigate(['home'], { replaceUrl: true });
      });
    }
  
    signInWithEmail() {

      this.auth.signInWithEmail(this.signInForm.value['email'], this.signInForm.value['password'])
      .then(user => {
        // navigate to user profile
        this.redirectLoggedUserToProfilePage();
      })
      .catch(error => {
        switch(error.code) { 
          case 'auth/user-not-found':
            this.submitError='El correo electrónico proporcionado no existen';
            break;
          case 'auth/wrong-password':
            this.submitError='La contraseña es incorrecto';
            break;
          default:
            this.submitError = error.message;
        }
      });
    }
}
