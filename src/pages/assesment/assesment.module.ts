import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssesmentPage } from './assesment';

@NgModule({
  declarations: [
    AssesmentPage,
  ],
  imports: [
    IonicPageModule.forChild(AssesmentPage),
  ],
  exports: [
    AssesmentPage
  ]
})
export class AssesmentPageModule {}
