import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserAssesmentsPage } from '../pages/user-assesments/user-assesments';
import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { BasicInformationPage } from '../pages/user-profile/basic-information/basic-information';
import { PersonalInformationPage } from '../pages/user-profile/personal-information/personal-information';
import { AssesmentResponsePage } from '../pages/assesment/assesment-response/assesment-response';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any, icon: string, color: string}>;
  loggedInUser: boolean = false;
  logoutParams: any = { title: 'Logout', component: '', icon: 'power', color: 'profile'};
  loginParams: any = { title: 'Login', component: '', icon: '', color: ''};

  constructor(
    public _authService: AuthenticationProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = IntroPage;
      if(_authService.currentUser != null) {
        this.pages.push(this.logoutParams);
      }
    });

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', color: "home" },
      { title: 'Assesments', component: UserAssesmentsPage, icon: 'clipboard', color: "archive"},
      { title: 'Profile', component: UserProfilePage, icon: 'person', color: "profile"},
      { title: 'Notifications', component: UserNotificationsPage, icon: 'notifications', color: "settings"},
    ];

    statusBar.styleDefault();
    splashScreen.hide();
    // this.menu.enable(true, 'whisper-menu');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.menu.close();
    if(page.title == "Logout") {
      this._authService.logout();
      this.nav.push(LoginPage);
    }
    else {
      console.log('nav page ', page);
      this.nav.push(page.component);
    }
    // this.menu.enable(false, 'whisper-menu');

  }



}

