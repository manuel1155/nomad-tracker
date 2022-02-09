import { NgModule, LOCALE_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgxDatatableModule } from '@swimlane/ngx-datatable';

import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeMX from '@angular/common/locales/es-MX';

import { SidemenuComponent } from './sidemenu/sidemenu.component';
registerLocaleData(localeMX);
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { Network } from '@ionic-native/network/ngx';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent,SidemenuComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  entryComponents: [],
  imports: [BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    NgxDatatableModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DatePipe,
    Geolocation,
    NativeGeocoder,
    AndroidPermissions,
    LocationAccuracy,
    CallNumber,
    Network, 
    AngularFirestoreModule,
    { provide: LOCALE_ID, useValue: "es-MX" },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
