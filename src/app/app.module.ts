import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule, Http } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AssesmentPage, FoundPharmaciesPage } from '../pages/assesment/assesment';
import { ContraceptiveQuantityPage } from '../pages/contraceptive-quantity/contraceptive-quantity';
import { ContraceptivePage } from '../pages/contraceptive/contraceptive';
import { ContraceptiveDescPage } from '../pages/contraceptive/contraceptive';
import { StartPage } from '../pages/contraceptive/contraceptive';
import { IntroPage } from '../pages/intro/intro';
import { UserAssesmentsPage } from '../pages/user-assesments/user-assesments';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SettingsPage } from '../pages/settings/settings';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { UserProvider } from '../providers/user/user';
import { BaseurlProvider } from '../providers/baseurl/baseurl';
import { ContraceptiveProvider } from '../providers/contraceptive/contraceptive';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AssesmentProvider } from '../providers/assesment/assesment';
import { Geolocation } from '@ionic-native/geolocation';
import { PharmacyProvider } from '../providers/pharmacy/pharmacy';
import { SharedProvider } from '../providers/shared/shared';
import { ReactiveFormsModule } from '@angular/forms';

export function getAuthHttp(http) {
  return new AuthHttp(new AuthConfig({
    noJwtError: true,
    tokenName: 'token',
    headerPrefix: 'JWT',
    headerName: 'Authorization',
    globalHeaders: [{'Accept': 'application/json'}, { 'Content-Type': 'application/json' }],
    tokenGetter: (() => localStorage.getItem('token')),
  }), http);
}

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    IntroPage,
    SignupPage,
    LoginPage,
    AssesmentPage,
    FoundPharmaciesPage,
    ContraceptivePage,
    StartPage,
    SettingsPage,
    UserProfilePage,
    UserAssesmentsPage,
    ContraceptiveDescPage,
    ContraceptiveQuantityPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    IntroPage,
    SignupPage,
    LoginPage,
    ContraceptivePage,
    ContraceptiveDescPage,
    StartPage,
    SettingsPage,
    UserProfilePage,
    UserAssesmentsPage,
    AssesmentPage,
    FoundPharmaciesPage,
    ContraceptiveQuantityPage
  ],
  providers: [
    Geolocation,
    StatusBar,
    SplashScreen,
    AuthenticationProvider,
    UserProvider,
    BaseurlProvider,
    ContraceptiveProvider,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    {
      provide: AuthHttp,
      useFactory: getAuthHttp,
      deps: [Http]
    },
    AssesmentProvider,
    PharmacyProvider,
    SharedProvider
  ]
})
export class AppModule {}
