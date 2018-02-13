import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../login/login';
import { AssesmentPage } from '../assesment/assesment';
import { Subscription} from 'rxjs/Subscription'

@IonicPage()
@Component({
  selector: 'page-contraceptive',
  templateUrl: 'contraceptive.html',
})
export class ContraceptivePage {
  contraceptives: Array<{id: string, title: string, description: string}>
  assesment: Array<{id: string, question: string, answer: {} }> = [];
  mocked_contraceptives: Array<{}> = [];
  subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider) {
  }


  ionViewDidLoad() {
    this.getAllContraceptive();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getAllContraceptive() {
    let prev_page = this.navCtrl.getActive().name;

    this._authService.tokenSubscription()
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    loading.present();

    this.subscription = this._contraceptiveService.getAll()
      .subscribe((resp) => {
          if (resp.success && resp.status == 200) {
            loading.dismiss();
            this.contraceptives = resp.contraceptives;
          } else {
          }
        }, (err) => {
        loading.dismiss();
        if (err.status == 401) {
          // Unable to log in
          let toast = this.toastCtrl.create({
            message: err.statusText,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.setRoot(LoginPage,{prev_page: prev_page});
        } else  if(err.status == "0"){
          let toast = this.toastCtrl.create({
            message: "Please check your internet connection",
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      })
  }


  goToAssesment(contraceptive) { 
    this.navCtrl.push(StartPage, {'contraceptive': contraceptive} );
  }

  loadAssesments(id, name) {
    let getAss = this._contraceptiveService.getAssesment(id)
    .subscribe((resp) => {
     if (resp.success && resp.status == 200) {
       this.assesment = resp.assessments
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
    this.subscription.add(getAss)
  }
}

@Component({
  selector: 'page-contraceptive-desc',
  templateUrl: 'contraceptive_desc.html',
})

export class ContraceptiveDescPage {
  contraceptive: any;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.contraceptive = this.navParams.get('contraceptive');
  }

  startAssesment() {
    this.navCtrl.push(AssesmentPage, { contraceptive: this.contraceptive });  
  }

}






@Component({
  selector: 'start-assesment',
  templateUrl: 'start-assesment.html',
})

export class StartPage {
  username: string;
  contraceptive: any;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider
  ) {
    this.username = this._authService.currentUser().firstName;
    console.log(this.username)
    this.contraceptive = this.navParams.get('contraceptive');
  }

  ionViewDidLoad() {}

  startAssesment() {
    this.navCtrl.push(AssesmentPage, { contraceptive: this.contraceptive });  
  }

  contraceptiveInfo(name, description) {
    this.navCtrl.push(ContraceptiveDescPage, { contraceptive: this.contraceptive });
  }

}