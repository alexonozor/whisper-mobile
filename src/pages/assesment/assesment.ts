import { Component, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../../pages/login/login';

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
      assesments: [
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
    public _authService: AuthenticationProvider) {
  }

  ionViewDidLoad(){
    this.loadAssesments(this.navParams.get('id'));
    this.contraceptive_id =  this.navParams.get('id');
    this.getUser();
  }

  getUser(){
    let userParams:any = JSON.parse(localStorage.getItem('user'));
    this.userId = userParams._id;
    this.username = userParams.userName;
  }

  loadAssesments(id) {
    this._contraceptiveService.getAssesment(id)
    .subscribe((resp) => {
       console.log('response ', resp);
       if (resp.success && resp.status == 200) {
         this.assesment = resp.assesments
         console.log('assesment ', this.assesment);
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

  startAssesment(){
    this.getUser();
    this.slides.slideNext();
  }

  nextSlide(question_id, question, answer) {
    console.log('question ', question);
    console.log('answer ', answer);
    this.assesmentParams.user_id = this.userId;
    this.assesmentParams.contraceptive_id = this.contraceptive_id;
    let assesment_obj = {
      'acceptedAnswer' : answer,
      'question' : question_id
    }
    this.assesmentParams.assesments.push(assesment_obj);
    console.log('assesment params ', this.assesmentParams);
    console.log('assesment objects ', assesment_obj);

    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.isEnd = this.slides.isEnd();
    console.log('has slide ended', this.isEnd);

  }

}
