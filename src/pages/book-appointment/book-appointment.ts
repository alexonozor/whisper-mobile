import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssesmentProvider } from '../../providers/assesment/assesment';

@IonicPage()
@Component({
  selector: 'page-book-appointment',
  templateUrl: 'book-appointment.html',
})
export class BookAppointmentPage {
  public booking = {
    month: '2017-01-01',
    timeStarts: '07:43'
  }
  public appointmentFormGroup: FormGroup;
  public submited: boolean = false;
  public responseId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public _assesmentService: AssesmentProvider) {
    this.appointmentForm();
    this.responseId = navParams.get('responseId')
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookAppointmentPage');
  }

  appointmentForm() {
    this.appointmentFormGroup = this.fb.group({
      appointment: this.fb.group({
        appointmentNote: ['', Validators.required ],
        appointmentTime: ['', Validators.required ],
        appointmentDate: ['', Validators.required ],
        isAppointment:[true]
      })
    })
  }

  bookAppointment() {
    console.log('appointment booked');
    this.submited = true;
    this._assesmentService.updateResponse(this.responseId, this.appointmentFormGroup.value)
    .subscribe((res) => {
      if (res.success) {
        // this.submited = false;
        console.log('user profile updated');
        //add toast
        // push to a page that says go home /take another assesment
      } else {
      }
    }, err => {
      // caught error
      console.log('an error occurred');
    })
  }
}
