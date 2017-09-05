import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserAssesmentsPage } from './user-assesments';

@NgModule({
  declarations: [
    UserAssesmentsPage,
  ],
  imports: [
    IonicPageModule.forChild(UserAssesmentsPage),
  ],
  exports: [
    UserAssesmentsPage
  ]
})
export class UserAssesmentsPageModule {}
