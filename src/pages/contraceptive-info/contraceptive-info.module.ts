import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContraceptiveInfoPage } from './contraceptive-info';

@NgModule({
  declarations: [
    ContraceptiveInfoPage,
  ],
  imports: [
    IonicPageModule.forChild(ContraceptiveInfoPage),
  ],
  exports: [
    ContraceptiveInfoPage
  ]
})
export class ContraceptiveInfoPageModule {}
