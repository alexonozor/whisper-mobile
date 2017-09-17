import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-assesment-response',
  templateUrl: 'assesment-response.html',
})
export class AssesmentResponsePage {

  // resizes textarea on keydown
  @ViewChild('myInput') myInput: ElementRef;
  showButton: boolean =  false;

  messageResponse = [
    {
      message: "hello, how are you?",
      time: "4.22am",
      owner: false
    },
    {
      message: "am fine, and you?",
      time: "4.22am",
      owner: true
    },
    {
      message: "am great, thanks",
      time: "4.22am",
      owner: false
    },
    {
      message: "How can we help sir?",
      time: "4.22am",
      owner: false
    }
  ]

  private form = this.formBuilder.group({
    'message': ['', Validators.required],
    'owner':[true],
    'time':['5am']
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder) {
  }

  ionViewDidLoad() {
  }

  sendAssesmentResponse() {
    this.messageResponse.push(this.form.value);
  }

  getFocus(event) {
    //resizes textarea
    let element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    let scrollHeight = element.scrollHeight;
    element.setAttribute('style', 'height:' + (element.scrollHeight) + 'px;overflow-y:hidden;');
    element.style.height = 'auto';
    element.style.height = (scrollHeight) + 'px';
    this.myInput['_elementRef'].nativeElement.style.height = element.style.height;

    if(event.target.value.length) {
      this.showButton = true;
    }else {
      this.showButton = false;
    }
  }

}
