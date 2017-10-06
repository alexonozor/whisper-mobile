import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AssessmentCompletionPage } from './assessment-completion';

@NgModule({
  declarations: [
    AssessmentCompletionPage,
  ],
  imports: [
    IonicPageModule.forChild(AssessmentCompletionPage),
  ],
  exports: [
    AssessmentCompletionPage
  ]
})
export class AssessmentCompletionPageModule {}
