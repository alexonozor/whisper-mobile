import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserAssesmentsPage } from '../pages/user-assesments/user-assesments';
import { HomePage } from '../pages/home/home';
import { IntroPage } from '../pages/intro/intro';
import { AuthenticationProvider } from '../providers/authentication/authentication';
import { SharedProvider } from '../providers/shared/shared';
import { LoginPage } from '../pages/login/login';
import { SettingsPage } from '../pages/settings/settings';
import { UserProfilePage } from '../pages/user-profile/user-profile';
import { BasicInformationPage } from '../pages/user-profile/basic-information/basic-information';
import { PersonalInformationPage } from '../pages/user-profile/personal-information/personal-information';
import { AssesmentResponsePage } from '../pages/assesment/assesment-response/assesment-response';
import { UserNotificationsPage } from '../pages/user-notifications/user-notifications';
import { BookAppointmentPage } from '../pages/book-appointment/book-appointment';
import { ContactListPage } from "../pages/contact-list/contact-list";
import { AppRate } from '@ionic-native/app-rate';
import { SocialSharing } from '@ionic-native/social-sharing';
import { AboutUsPage } from '../pages/about-us/about-us';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any;
  pages: Array<{title: string, component: any, icon: string, color: string, enableNotification: boolean}>;
  loggedInUser: boolean = false;
  logoutParams: any = { title: 'Logout', component: '', icon: 'power', color: '#fff'};
  notificationCount: number = 0;
  currentUser: any;
  config: any;

  constructor(
    public _authService: AuthenticationProvider,
    public platform: Platform,
    statusBar: StatusBar,
    splashScreen: SplashScreen,
    public menu: MenuController,
    public events: Events,
    private appRate: AppRate,
    private socialSharing: SocialSharing,
    public _shared: SharedProvider
    ) {
      this.currentUser = this._authService.currentUser();
      

    this.initializeApp();
    this.pages = [
      { title: 'Home', component: HomePage, icon: 'home', color: "#fff", enableNotification: false },
      { title: 'Assessments', component: UserAssesmentsPage, icon: 'clipboard', color: "#fff", enableNotification: false},
      { title: 'Profile', component: UserProfilePage, icon: 'person', color: "#fff", enableNotification: false},
      { title: 'Notifications', component: UserNotificationsPage, icon: 'notifications', color: "#fff", enableNotification: true},
      { title: 'Contact us', component: ContactListPage, icon: 'ios-call', color: "#fff", enableNotification: false},
      { title: 'About us', component: AboutUsPage, icon: 'information-circle', color: "#fff", enableNotification: false},
      { title: 'Rate Whisper', component: UserProfilePage, icon: 'star', color: "#fff", enableNotification: false},
      { title: 'settings', component: SettingsPage, icon: 'settings', color: "#fff", enableNotification: false},
    ];

    statusBar.styleDefault();
    splashScreen.hide();
    this.setUpAppConfig()
    events.subscribe('notification:count', (count) => {
      this.notificationCount = count;
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.rootPage = IntroPage;
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
     } else if (page.title == 'Rate Whisper') {
       this.rateApplication()
     } else {
      this.nav.setRoot(page.component);
    }
  }

  setUpAppConfig() {
    this._shared.saveAppConfig()
    .subscribe((resp) => {
      if (resp.success) {
        this._authService.saveToken('config', resp.config);
        this.config = this._shared.getAppConfig('config')
      }
    }, err => {
      alert('error: unable to setup application config, app may not work properly.');
    })
  }



  rateApplication() {
    this.appRate.preferences = {
      displayAppName: '',
      usesUntilPrompt: 3,
      promptAgainForEachNewVersion: false,
      storeAppURL: {
        ios: this.config.IOS_NUMBER,
        android: this.config.ANDROID_MARKET_DETAILS
      },
      customLocale: {
        title: 'Rate Whisper',
        message: 'We will appriciate your rating',
        cancelButtonLabel: "Cancel",
        laterButtonLabel: "Maybe Later",
        rateButtonLabel: "Rate Now"
      },
      callbacks: {
        onButtonClicked: () => {
          console.log('clicked')
        },
        onRateDialogShow: () => {
          return
        }
       }
    };   
    this.appRate.promptForRating(false);
  }

  whatsApp() {
    this.socialSharing.shareViaWhatsApp('Download the new whisper application for free contracpetive assessment', this.config.SHARE_PHOTO_URL, this.config.STORE_URL)
    .then(() => {

    }).catch(() => {
      alert('Error: unable to share');
    })
  }

  facebook() {
    this.socialSharing.shareViaFacebook('Download the new whisper application for free contracpetive assessment', this.config.SHARE_PHOTO_URL, this.config.STORE_URL)
    .then(() => {

    }).catch(() => {
      alert('Error: unable to share');
    })
  }

 



}

