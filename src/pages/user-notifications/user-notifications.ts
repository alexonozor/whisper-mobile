import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, Events } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { AssesmentResponsePage } from '.././assesment/assesment-response/assesment-response';
import { ContactConversationPage } from '.././contact-list/contact-list';

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
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public events: Events
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
      let toast = this.toastCtrl.create({
        message: "Please check your internet connection",
        duration: 3000,
        position: 'top'
      });
      toast.present();
      loading.dismissAll(); 
      this.navCtrl.pop()         
    })
  }

  
  goToNotification(notification) {
    notification.seen = true
    this.updateNotificationStatus(notification)
    if (notification.notification_type == "openConversation") {
      this.navCtrl.push(AssesmentResponsePage, {conversationId: notification.notification_type_id})
    } else if (notification.notification_type == "message") {
      this.navCtrl.push(ContactConversationPage, { threadId: notification.notification_type_id });
    }
  }

  updateNotificationStatus(notification) {
    this._notification.updateNotifications(notification._id, {seen: true})
    .subscribe((resp) => {
      this._notification.getUserNotificationsCount(this.currentUser._id)
      .subscribe((resp) => {
        this.events.publish('notification:count', +resp.count);
      }, err => {

      })
    }, err => {
      console.log('Err');
    })
  }

}
