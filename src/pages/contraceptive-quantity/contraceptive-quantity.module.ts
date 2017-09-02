import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContraceptiveQuantityPage } from './contraceptive-quantity';

@NgModule({
  declarations: [
    ContraceptiveQuantityPage,
  ],
  imports: [
    IonicPageModule.forChild(ContraceptiveQuantityPage),
  ],
  exports: [
    ContraceptiveQuantityPage
  ]
})
export class ContraceptiveQuantityPageModule {}
