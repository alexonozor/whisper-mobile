import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContraceptivePage } from './contraceptive';

@NgModule({
  declarations: [
    ContraceptivePage,
  ],
  imports: [
    IonicPageModule.forChild(ContraceptivePage),
  ],
  exports: [
    ContraceptivePage
  ]
})
export class ContraceptivePageModule {}
