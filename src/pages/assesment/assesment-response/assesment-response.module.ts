import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssesmentResponsePage } from './assesment-response';

@NgModule({
  declarations: [
    AssesmentResponsePage,
  ],
  imports: [
    IonicPageModule.forChild(AssesmentResponsePage),
  ],
  exports: [
    AssesmentResponsePage
  ]
})
export class AssesmentResponsePageModule {}
