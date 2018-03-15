import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { LoginPage } from '../login/login';
import { TermsAndConditionsPage } from '../terms-and-conditions/terms-and-conditions';
import { NotificationProvider } from '../../providers/notification/notification';
import { SharedProvider } from '../../providers/shared/shared';
/**
 * Generated class for the SettingsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  versionNumber: any;
  currentUser: any;
  accountType: Array<any> = ['Member', 'Pharmacist', 'Doctor'];
  loading: any;

  constructor(
    public plaform: Platform,
    public loadingCtrl: LoadingController,
    private appVersion: AppVersion,
    public navCtrl: NavController, 
    public authentication: AuthenticationProvider,
    public alertCtrl: AlertController,
    public userService: UserProvider,
    public toaster: ToastController,
    public notification: NotificationProvider,
    public navParams: NavParams,
    public shared: SharedProvider
  ) {
      this.currentUser = this.authentication.currentUser();
  }


  loader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loading.present();
  }

  dismissLoader() { 
    this.loading.dismiss();
  }

  ionViewDidLoad() {
    if (this.plaform.is('mobile')) {
     this.getPlatform();
    }
  }

  changeAccount() {
    let alert = this.alertCtrl.create();
    alert.setTitle('Change Account');
    this.accountType.forEach((el, index) => {
      alert.addInput({
        type: 'radio',
        label: el,
        value: el,
        checked: (el == this.currentUser.accountType)
      });
    })
  
    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if (data != this.currentUser.accountType) { // Don't sent notification if the user didn't change anything.
          this.sendNotificationToAdmin(data);
        }    
      }
    });
    alert.present();
  }

  sendNotificationToAdmin(data) {
    this.loader()
    this.notification.create({
      sender: this.currentUser._id,
      receiver: this.userService.allAdmin()[0]._id, 
      notification_type_id: this.currentUser._id,
      notification_type: 'AccountRequest',
      content: `wants to be (a/an) ${data}`
    })
    .subscribe((resp) => {
      this.dismissLoader()
      if (resp.success) {
        let toast =  this.toaster.create({
          message: `Thank you! We have received your request to become an/a ${data}.
            We will contact you shortly..
          `,
          duration: 4000,
          position: 'top'
        })
        toast.present();
      }
    }, err => {
      this.dismissLoader();
      alert('Error: Network or server error');
    })
  }

  logout() {
    this.navCtrl.push(LoginPage);
    this.authentication.logout();
  }

  gotToTermsAndConditions() {
    this.navCtrl.push(TermsAndConditionsPage);
  }


  deleteAccount() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      subTitle: `All your data and assessments will be lost.
                 Deleting your account cannot be undone.`,
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteUserAccount()
          }
        }
      ]
    });
    alert.present();
  }


  deleteUserAccount() {
    this.loader();
    this.userService.update({ deleted: true }, this.currentUser._id)
    .subscribe((resp) => {
      if (resp.success) {
        this.dismissLoader()
        this.authentication.logout()
        this.navCtrl.push(LoginPage);
        this.alertCtrl.create({
          message: 'Your account has been deleted.'
        })
      }
    }, err => {
      this.dismissLoader();
      alert('Error: internet or server');
    })
  }

  getPlatform() {
    this.versionNumber = this.appVersion.getVersionNumber().then(version => {
      this.versionNumber = version;
    });
  }

  recieveEmail(event) {
    this.loader();
    this.userService.update({ recieveEmail: event.checked }, this.currentUser._id)
    .subscribe((resp) => {
      if (resp.success) {
        this.dismissLoader()
        this.authentication.saveUser(resp.user);
        this.alertCtrl.create({
          message: 'Updated'
        })
      }
    }, err => {
      this.dismissLoader();
      alert('Error: internet or server');
    })
  }
}
