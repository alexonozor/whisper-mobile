import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { AssesmentResponsePage } from '.././assesment/assesment-response/assesment-response';

/**
 * Generated class for the UserNotificationsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-user-notifications',
  templateUrl: 'user-notifications.html',
})
export class UserNotificationsPage {
  currentUser: any;
  notifications: Array<any>;
  no_notification: boolean;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _notification: NotificationProvider,
    public _auth: AuthenticationProvider,
    public _userService: UserProvider,
    public loadingCtrl: LoadingController
  ) {
    this.currentUser = this._auth.currentUser();
  }

  ionViewDidLoad() {
    this.getNotification()
  }

  getNotification() {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    loading.present();

    this._notification.getUserNotifications(this.currentUser._id)
    .subscribe((res) => {
      loading.dismiss();
      this.notifications = res.notifications;
    }, err => {
      loading.dismissAll();          
    })
  }

  
  goToNotification(notification) {
    if (notification.notification_type == "openConversation") {
      this.navCtrl.push(AssesmentResponsePage, {conversationId: notification.notification_type_id})
    }
  }

}
