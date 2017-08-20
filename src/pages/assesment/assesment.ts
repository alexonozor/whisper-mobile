import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
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
  assesment: Array<{id: string, question: string, answer: {} }> = [];
  contraceptive_id: string;
  contraceptive_name: string;
  isEnd: boolean = false;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider) {
  }

  ionViewDidLoad(){
    this.loadAssesments(this.navParams.get('id'));
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

  nextSlide(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.isEnd = this.slides.isEnd();
    console.log('has slide ended', this.isEnd);

  }

}
