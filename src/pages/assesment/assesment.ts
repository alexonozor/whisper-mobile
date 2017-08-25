import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

/**
 * Generated class for the AssesmentPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

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

  assesment: any;
  contraceptive_id: string;
  contraceptive_name: string;
  isEnd: boolean = false;
  userId: string;
  username: string;

  constructor(
    private alertCtrl: AlertController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider,
    public _assesmentService: AssesmentProvider) {
  }

  ionViewDidLoad(){
    this.loadAssesments(this.navParams.get('id'));
    this.contraceptive_id =  this.navParams.get('id');
    this.getUser();
  }

  getUser() {
    let userParams:any = JSON.parse(localStorage.getItem('user'));
    this.userId = userParams._id;
    this.username = userParams.userName;
  }

  loadAssesments(id) {
    this._contraceptiveService.getAssesment(id)
    .subscribe((resp) => {
       if (resp.success && resp.status == 200) {
         this.assesment = resp.assesments
       } else {
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
    // this.slides.lockSwipeToNext(true);
  }

  nextSlide(question_id, question, answer) {
    // this.slides.lockSwipeToNext(true);
    this.assesmentParams.user = this.userId;
    this.assesmentParams.contraceptive = this.contraceptive_id;
    let assesment_obj = {
      'question' : question_id,
      'acceptedAnswer' : answer
    }
    this.assesmentParams.questions.push(assesment_obj);
    this.slides.slideNext();
    this.isEnd = this.slides.isEnd();
  }

  submitAssesment(value) {
    this.assesmentParams.note = value.value;
    this.assesmentParams.questions.shift();
    this._assesmentService.submitAssesment(this.assesmentParams)
    .subscribe((resp) => {
      if (resp.success) {
        this.navCtrl.push(HomePage)
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

}
