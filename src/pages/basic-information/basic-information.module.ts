import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BasicInformationPage } from './basic-information';

@NgModule({
  declarations: [
    BasicInformationPage,
  ],
  imports: [
    IonicPageModule.forChild(BasicInformationPage),
  ],
  exports: [
    BasicInformationPage
  ]
})
export class BasicInformationPageModule {}
