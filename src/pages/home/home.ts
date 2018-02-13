import { Component } from '@angular/core';
import { MenuController, NavController, Events } from 'ionic-angular';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { UserNotificationsPage } from '../../pages/user-notifications/user-notifications';
import { LoginPage } from '../../pages/login/login'
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { NotificationProvider } from '../../providers/notification/notification';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rootPage: any = HomePage;
  public backgroundImage = 'assets/img/background.png';
  notificationCount: Number = 0;
  currentUser: any;

  constructor(
    public navCtrl: NavController,
    public menuCtlr: MenuController,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider,
    public _notification: NotificationProvider,
    public events: Events
  ) {
    
    console.log(this.currentUser)
    events.subscribe('notification:count', (count) => {
      this.notificationCount = count;
    })
  }

  ionViewDidLoad() {
    this._userService.getAdminUsers().subscribe((res) => {
      if (res.success) {
        this._userService.saveAdminUsers(res.users)
        this.getNotificationCount(this._authService.currentUser()._id)
      } else {
        
      }
    }, err => {
      
    })
  }

  getContraceptive() {
    if (this._authService.currentUser() != null) {
      this.navCtrl.push(ContraceptivePage);
    }else{
      this.navCtrl.push(LoginPage, {prev_page: this.navCtrl.getActive()});
    }
  }

  askHealthProvider() {
    this.navCtrl.push(ContraceptivePage)
  }

  getNotificationCount(userId) {
    this._notification.getUserNotificationsCount(userId)
    .subscribe((resp) => {
      this.notificationCount = +resp.count;
      this.events.publish('notification:count', this.notificationCount);
    }, err => {

    })
  }

  goToNotification() {
    this.navCtrl.push(UserNotificationsPage)
  }
}
