import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserNotificationsPage } from './user-notifications';

@NgModule({
  declarations: [
    UserNotificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserNotificationsPage),
  ],
  exports: [
    UserNotificationsPage
  ]
})
export class UserNotificationsPageModule {}
