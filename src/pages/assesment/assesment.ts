import { Component, ViewChild, ElementRef } from '@angular/core';
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

  assesment_obj : any = {
    'acceptedAnswer' : '',
    'question' : ''
  }

  // resizes textarea on keydown
  @ViewChild('myInput') myInput: ElementRef;

  assesment: any;
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
  }

  slideNext(){
    this.slides.slideNext();
    this.isEnd = this.slides.isEnd();
  }

  nextSlide(question_id, question, answer, isEditedAnswer, label) {
    this.question_id = question_id;
    this.assesmentParams.user = this.userId;
    this.assesmentParams.contraceptive = this.contraceptive_id;

    this.assesment_obj = {
      'acceptedAnswer':answer,
      'question':question_id
    }

    if(isEditedAnswer) {
      this.editedInput = true;
      this.editedInputLabel = label;
    } else {
      this.answer_exists = this.findOrReplaceAnswer(this.assesmentParams.questions, 'question', question_id, this.assesment_obj)
      if(!this.answer_exists){
        this.assesmentParams.questions.push(this.assesment_obj);
        this.slideNext();
      }else{
        this.slideNext();
      }
    }
  }

  findOrReplaceAnswer(assesment, key, value, obj) {
    for( let question in this.assesmentParams.questions){
      if(assesment[question][key] === value) {
        this.assesmentParams.questions.splice(question,question,obj);
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
    }
  }

  getText(event) {
    this.edited_answer = event._value;
  }

  submitEditedAnswer() {
    this.assesment_obj = {
      'acceptedAnswer':this.edited_answer,
      'question':this.question_id
    }

    this.answer_exists = this.findOrReplaceAnswer(this.assesmentParams.questions, 'question', this.question_id, this.assesment_obj)

    if(!this.answer_exists){
      this.assesmentParams.questions.push(this.assesment_obj);
      this.slideNext();
    }
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
