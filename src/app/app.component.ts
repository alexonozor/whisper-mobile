import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any;

  constructor(
    _authService: AuthenticationProvider,
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen) {
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
      statusBar.styleDefault();
      splashScreen.hide();
  }
}

