import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
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
  pages: Array<{title: string, component: any, icon: string, color: string, enableNotification: boolean}>;
  loggedInUser: boolean = false;
  logoutParams: any = { title: 'Logout', component: '', icon: 'power', color: 'logout'};
  loginParams: any = { title: 'Login', component: '', icon: '', color: ''};
  notificationCount: number = 0;
  constructor(
    public _authService: AuthenticationProvider,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public events: Events
    ) {
    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', color: "home", enableNotification: false },
      { title: 'Assesments', component: UserAssesmentsPage, icon: 'clipboard', color: "archive", enableNotification: false},
      { title: 'Profile', component: UserProfilePage, icon: 'person', color: "profile", enableNotification: false},
      { title: 'Notifications', component: UserNotificationsPage, icon: 'notifications', color: "settings", enableNotification: true},
      { title: 'Contact us', component: UserProfilePage, icon: 'ios-call', color: "black", enableNotification: false},
      { title: 'About us', component: UserProfilePage, icon: 'information-circle', color: "profile", enableNotification: false},
    ];
    

    

    statusBar.styleDefault();
    splashScreen.hide();
    events.subscribe('notification:count', (count) => {
      this.notificationCount = count;
    })
    
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = IntroPage;
      if(this._authService.currentUser != null) {
        this.pages.push(this.logoutParams);
      }
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
     this.menu.close();
     this.menu.enable(true, 'whisper-menu');
     if (page.title == "Logout") {
       this._authService.logout();
       this.nav.push(LoginPage);
     } else {
      this.nav.setRoot(page.component);
    }
    

  }



}

