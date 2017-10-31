import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule, Http } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { BookAppointmentPage, AppointmentLandingPage } from '../pages/book-appointment/book-appointment';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { AssesmentPage, FoundPharmaciesPage, NonEligiblePage } from '../pages/assesment/assesment';
import { AssesmentResponsePage } from '../pages/assesment/assesment-response/assesment-response';
import { ContraceptiveQuantityPage } from '../pages/contraceptive-quantity/contraceptive-quantity';
import { ContraceptivePage } from '../pages/contraceptive/contraceptive';
import { ContraceptiveDescPage } from '../pages/contraceptive/contraceptive';
import { StartPage } from '../pages/contraceptive/contraceptive';
import { IntroPage } from '../pages/intro/intro';
import { UserAssesmentsPage, ResponseInfoPage } from '../pages/user-assesments/user-assesments';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { SettingsPage } from '../pages/settings/settings';
import { BasicInformationPage } from '../pages/user-profile/basic-information/basic-information';
import { PersonalInformationPage } from '../pages/user-profile/personal-information/personal-information';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { UserProvider } from '../providers/user/user';
import { BaseurlProvider } from '../providers/baseurl/baseurl';
import { ContraceptiveProvider } from '../providers/contraceptive/contraceptive';
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { AssesmentProvider } from '../providers/assesment/assesment';
import { Geolocation } from '@ionic-native/geolocation';
import { PharmacyProvider } from '../providers/pharmacy/pharmacy';
import { SharedProvider } from '../providers/shared/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { NotificationProvider } from '../providers/notification/notification';

const config: SocketIoConfig = { url: 'https://whisper-admin.herokuapp.com', options: {} };
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
    NonEligiblePage,
    ContraceptivePage,
    StartPage,
    SettingsPage,
    UserProfilePage,
    UserAssesmentsPage,
    ContraceptiveDescPage,
    ContraceptiveQuantityPage,
    BasicInformationPage,
    PersonalInformationPage,
    BookAppointmentPage,
    AppointmentLandingPage,
    AssesmentResponsePage,
    ResponseInfoPage,
    UserNotificationsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
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
    NonEligiblePage,
    ContraceptiveQuantityPage,
    BasicInformationPage,
    PersonalInformationPage,
    BookAppointmentPage,
    AppointmentLandingPage,
    AssesmentResponsePage,
    ResponseInfoPage,
    UserNotificationsPage
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
    SharedProvider,
    NotificationProvider
  ]
})
export class AppModule {}
