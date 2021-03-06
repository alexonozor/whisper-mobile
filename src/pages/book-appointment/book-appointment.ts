import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../../pages/home/home';
import { DateTime } from 'ionic-angular/components/datetime/datetime';
import moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-book-appointment',
  templateUrl: 'book-appointment.html',
})
export class BookAppointmentPage {
  public currentDate: String = new Date().toISOString();

  public time;
  public date = moment().format();
  public minDate = moment().add(1, 'days').calendar();
  
    
  public appointmentFormGroup: FormGroup;
  public submited: boolean = false;
  public responseId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public _assesmentService: AssesmentProvider) {
    this.appointmentForm();
    this.responseId = navParams.get('responseId');
    this.minDate = moment().format();

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BookAppointmentPage');
  }

  appointmentForm() {
    this.appointmentFormGroup = this.fb.group({
      success: [true],
      appointment: this.fb.group({
        appointmentNote: ['' ],
        appointmentTime: [''],
        appointmentDate: [''],
        isAppointment:[true]
      })
    })
  }

  bookAppointment() {
    this.submited = true;
    this._assesmentService.updateResponse(this.responseId, this.appointmentFormGroup.value)
    .subscribe((res) => {
      if (res.success) {
        // this.submited = false;
        this.navCtrl.push(AppointmentLandingPage, { message: "Thanks for booking an appointment, We would contact you shortly." });
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

@Component({
  selector: 'page-appointment-landing',
  templateUrl: 'appointment-landing.html',
})

export class AppointmentLandingPage {
  message : String;
  constructor(
    public _assesmentService: AssesmentProvider,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.message = navParams.get('message');
  }


  goHome() {
    this.navCtrl.setRoot(HomePage);
  }
  goToContraceptive() {
    this.navCtrl.setRoot(ContraceptivePage);
  }
};
