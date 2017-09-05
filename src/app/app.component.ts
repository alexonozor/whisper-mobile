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

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any, icon: string, color: string}>

  constructor(
    _authService: AuthenticationProvider,
    platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      let token = _authService.getToken('introShown');
        if (token) {
            console.log('intro shown? ', token);
            if (_authService.loggedIn()) {
               this.rootPage =  HomePage;
            } else {
              this.rootPage = LoginPage;
            }
        } else {
            _authService.saveToken('introShown', 'true');
            this.rootPage = IntroPage;
        }
    });

    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', color: "home" },
      { title: 'Assesments', component: UserAssesmentsPage, icon: 'archive', color: "archive"},
      { title: 'Profile', component: UserProfilePage, icon: 'person', color: "profile"},
      { title: 'Settings', component: SettingsPage, icon: 'settings', color: "settings"}
    ];

    statusBar.styleDefault();
    splashScreen.hide();
    this.menu.enable(true, 'whisper-menu');
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}

