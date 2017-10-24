import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NotificationProvider } from '../../providers/notification/notification';
import { AuthenticationProvider } from '../../providers/authentication/authentication'
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

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public _notification: NotificationProvider,
    public _auth: AuthenticationProvider
  ) {
    this.currentUser = this._auth.currentUser();
  }

  ionViewDidLoad() {
    this.getNotification()
  }

  getNotification() {
    console.log(this.currentUser)
    this._notification.getUserNotifications(this.currentUser._id)
    .subscribe((res) => {
      this.notifications = res.notifications;
    }, err => {
      
    })
  }

  goToNotification(notification) {
    if (notification.notification_type == "openConversation") {
      this.navCtrl.push(AssesmentResponsePage, {conversationId: notification.notification_type_id})
    }
  }

}
