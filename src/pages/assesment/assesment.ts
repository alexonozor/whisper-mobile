import { Component, ViewChild, ElementRef } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { ContraceptivePage } from   '../contraceptive/contraceptive';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { Geolocation } from '@ionic-native/geolocation';
import { Http } from '@angular/http';
import { PharmacyProvider } from '../../providers/pharmacy/pharmacy';
import { BookAppointmentPage, AppointmentLandingPage  } from '../book-appointment/book-appointment';
import { StartPage } from '../contraceptive/contraceptive'
import { ContraceptiveQuantityPage } from '../contraceptive-quantity/contraceptive-quantity';


@IonicPage()
@Component({
  selector: 'page-assesment',
  templateUrl: 'assesment.html',
})
export class AssesmentPage {

  @ViewChild('slides') slides: any;
  questions: any;
  slideOptions : any;
  assesmentParams: any = {
      user: '',
      contraceptive: '',
      note: '',
      questions: [
        {
          acceptedAnswer: '',
          question: ''
        }
      ]
  };

  assesment_obj : any = {
    'acceptedAnswer' : '',
    'question' : ''
  }

  // resizes textarea on keydown
  @ViewChild('myInput') myInput: ElementRef;

  assesment: any;
  related_contraceptives: Array<any> = [];
  contraceptive_id: string;
  contraceptive_name: string;
  editedInput: boolean = false;
  showButton: boolean =  false;
  answer_exists: boolean;
  editedInputLabel: string;
  edited_answer: string;
  isEnd: boolean = false;
  userId: string;
  username: string;
  question_id: string;
  responseId: number;
  lock_swipes: boolean = true;
  isAppointment: boolean;
  nonEligibilityCount: number = 0;
  hasPrev: boolean = false;


  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider,
    private geolocation: Geolocation,
    public _assesmentService: AssesmentProvider,
    public _pharmacyService: PharmacyProvider,
    public http: Http) {
  }

  ionViewDidLoad(){
    this.loadAssesments(this.navParams.get('id'));
    this.contraceptive_id =  this.navParams.get('id');
    this.contraceptive_name = this.navParams.get('name');
    this.isAppointment = this.navParams.get('appointment');
    this.related_contraceptives = this.navParams.get('related');
    this.getUser();
    this.slides.lockSwipes(true);
  }

  getUser() {
    let userParams:any = this._authService.currentUser();
    if(userParams) {
      this.userId = userParams._id;
      this.username = userParams.userName;
    }
  }

  loadAssesments(id) {
    console.log('contraceptive id ', id);
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    loading.present();

    this._contraceptiveService.getAssesment(id)
    .subscribe((resp) => {
      loading.dismiss();
      if (resp.success && resp.status == 200) {
        this.assesment = resp.assesments
        console.log('assesments ', this.assesment);
      }
    }, (err) => {
      if (err.status == 401) {
          // Unable to log in
        let toast = this.toastCtrl.create({
          message: err.statusText,
          duration: 3000,
          position: 'top'
        });
        toast.present();

        this.navCtrl.setRoot(LoginPage).then(() => {
            this.navCtrl.popToRoot();
        });
      }
    })
  }

  startAssesment() {
    this.slides.slideNext();
  }

  slideNext() {
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
    this.slides.lockSwipeToPrev(false);
    this.isEnd = this.slides.isEnd();
    if(this.isEnd) {
      this.slides.lockSwipeToPrev(true);
    }
  }

  nextSlide(question_id, question, answer, isEditedAnswer, label, eligible) {
    this.hasPrev = true;
    if(!eligible) {
      this.nonEligibilityCount += 1;
    }
    this.question_id = question_id;
    this.assesmentParams.user = this.userId;
    this.assesmentParams.contraceptive = this.contraceptive_id;

    this.assesment_obj = {
      'acceptedAnswer':answer,
      'question':question_id
    }

    if (isEditedAnswer) {
      this.editedInput = true;
      this.editedInputLabel = label;
    } else {
      this.answer_exists = this.findOrReplaceAnswer(this.assesmentParams.questions, 'question', question_id, this.assesment_obj)
      if (!this.answer_exists) {
        this.assesmentParams.questions.push(this.assesment_obj);
        this.slideNext();
      } else {
        this.slideNext();
      }
    }
  }

  findOrReplaceAnswer(assesment, key, value, obj) {
    for( let question in this.assesmentParams.questions){
      if(assesment[question][key] === value) {
        this.assesmentParams.questions.splice(question, question,obj);
        this.slideNext();
        return true;
      }
    }
  }

  getFocus(event) {
    //resizes textarea
    var element = this.myInput['_elementRef'].nativeElement.getElementsByClassName("text-input")[0];
    var scrollHeight = element.scrollHeight;
    element.style.height = scrollHeight + 'px';
    this.myInput['_elementRef'].nativeElement.style.height = (scrollHeight + 16) + 'px';

    if(event.target.value != "") {
      this.showButton = true;
    }else {
      this.showButton = false;
    }
  }

  getText(event) {
    this.edited_answer = event._value;
  }

  submitEditedAnswer() {
    this.assesment_obj = {
      'acceptedAnswer': this.edited_answer,
      'question': this.question_id
    }

    this.answer_exists = this.findOrReplaceAnswer(
      this.assesmentParams.questions,
      'question',
      this.question_id,
      this.assesment_obj
    );

    if (!this.answer_exists){
      this.assesmentParams.questions.push(this.assesment_obj);
      this.slideNext();
    }
    this.editedInput = false;
    this.showButton = false;
  }

  submitAssesment(value) {
    this.assesmentParams.note = value.value;
    this.assesmentParams.questions.shift();
    this._assesmentService.submitAssesment(this.assesmentParams)
    .subscribe((resp) => {
      if (resp.success) {
        console.log('response ', resp);
        console.log('response id ', resp.responseId);
        this.responseId = resp.responseId;
        // checks eligibility count
        if(this.nonEligibilityCount >= 1) {
          console.log('contraceptive name ', this.contraceptive_name)
          this.navCtrl.push(NonEligiblePage, {contraceptive_name: this.contraceptive_name, 
          related_contraceptives: this.related_contraceptives});
        }else{
          this.confirmIfUserWantsToPurchase(this._authService.currentUser(), this.responseId);
        }
      } else {
          // Unable to submit assesment
        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
      // Unable to submit assesment
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  confirmIfUserWantsToPurchase(user, assesmentId) {
    let confirm = this.alertCtrl.create({
      title: 'Purchase Contraceptive',
      message: `Congrats you are eligible for this method. Would you like to get it?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            this.navCtrl.push(AppointmentLandingPage, {message: 'You can always purchase at any time you want'})
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if(this.isAppointment) {
              this.navCtrl.push(BookAppointmentPage, {responseId: this.responseId});
            }
            else{
              this.navCtrl.push(
                 ContraceptiveQuantityPage,
                { contraceptive: this.contraceptive_id, user: user, assesmentId: assesmentId }
              );
            }
          }
        }
      ]
    });
    confirm.present();
  }
}


@Component({
  selector: 'page-found-pharmacies',
  templateUrl: 'found-pharmacies.html',
})

export class FoundPharmaciesPage {
  public pharmacies = [];
  public responseId: number;

  constructor(
    public _assesmentService: AssesmentProvider,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
  ) {
    this.pharmacies = navParams.get('pharmacies');
    this.responseId = navParams.get('responseId');
  }

  updateUserAssessmentResponse(pharmacyId) {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: 'contacting pharmacy...'
    });
    loading.present();
    this._assesmentService.updatAssessmenteResponse(this.responseId, pharmacyId)
    .subscribe((resp) => {
      if (resp.success) {
        loading.dismiss();
        let toast = this.toastCtrl.create({
           message: 'You pickup order has been placed an administartor will contact you shortly',
            duration: 3000,
            position: 'top'
        })

        toast.present();
        this.navCtrl.push(AppointmentLandingPage, {message: 'Order Success'});
      }
    }, err => {

    })
  }
};


@Component({
  selector: 'page-noneligble',
  templateUrl: 'noneligible.html',
})

export class NonEligiblePage {
  contraceptive: string;
  message: string;
  related: Array<any> = [];
  no_related: boolean;

  constructor(
    public _assesmentService: AssesmentProvider,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {
    this.contraceptive = this.navParams.get('contraceptive_name');
    this.related = this.navParams.get('related_contraceptives');
    this.checkRelated(this.related);
    this.message = `We are sorry, but you are not eligible to purchase a ${this.contraceptive}, 
    We suggest you try out any of this contraceptives below`;
  }

  checkRelated(related) {
    if( related == []  ) {
      this.no_related = true;
    } else {
      this.no_related = false; 
    }
  }

  goToRelatedContraceptive(id,name,appointment,contraceptive) {
    this.navCtrl.push(StartPage, {id: id, name: name, appointment: appointment, contraceptive: contraceptive});
  }

  goHome() {
    this.navCtrl.setRoot(HomePage);
  }

  getContraceptive() {
    this.navCtrl.setRoot(ContraceptivePage);
  }
}
