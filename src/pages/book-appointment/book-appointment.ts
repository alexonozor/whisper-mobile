import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams , ToastController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../../pages/home/home';
import { Subscription} from 'rxjs/Subscription';

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
  subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public navParams: NavParams,
    public fb: FormBuilder,
    public _assesmentService: AssesmentProvider) {
    this.appointmentForm();
    this.responseId = navParams.get('responseId')
  }

  ionViewDidLoad() {
  }

  ionViewWilLeave() {
    this.subscription.unsubscribe();
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

  toaster(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  bookAppointment() {
    this.submited = true;
    this.subscription = this._assesmentService.updateResponse(this.responseId, this.appointmentFormGroup.value)
    .subscribe((res) => {
      if (res.success) {
        // this.submited = false;
        this.navCtrl.push(AppointmentLandingPage, {message: "Thanks for booking an appointment, We would contact you shortly."});
      } else {
        this.toaster(res.message);
      }
    }, err => {
      this.toaster('An error occurred');
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
    this.navCtrl.push(ContraceptivePage);
  }
};
