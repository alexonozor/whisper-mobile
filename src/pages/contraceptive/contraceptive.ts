import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../login/login';
import { AssesmentPage } from '../assesment/assesment';

/**
 * Generated class for the ContraceptivePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contraceptive',
  templateUrl: 'contraceptive.html',
})
export class ContraceptivePage {
  contraceptives: Array<{id: string, title: string, description: string}>
  assesment: Array<{id: string, question: string, answer: {} }> = [];

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider) {
  }


  ionViewDidLoad() {
    this._authService.tokenSubscription()
    let loading = this.loadingCtrl.create({
    spinner: 'show',
    showBackdrop: false,
    content: 'Loading Please Wait...'
   });
   loading.present();

  this._contraceptiveService.getAll()
   .subscribe((resp) => {
     if (resp.success && resp.status == 200) {
        loading.dismiss();
        this.contraceptives = resp.contraceptives;
        console.log('contraceptives ', resp.contraceptives);
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

        this.navCtrl.setRoot(LoginPage).then(() => {
            this.navCtrl.popToRoot();
        });
     }
   })
  }

  goToAssesment(id,name) {
    this.navCtrl.push(StartPage, {id: id, name: name});
  }

  loadAssesments(id, name) {
    this._contraceptiveService.getAssesment(id)
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
  }

  contraceptiveInfo(name, description){
    this.navCtrl.push(ContraceptiveDescPage, { name: name, description: description });
  }

}

@Component({
  selector: 'page-contraceptive-desc',
  templateUrl: 'contraceptive_desc.html',
})

export class ContraceptiveDescPage {
  contraceptive_name : string;
  contraceptive_description : string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.contraceptiveInfo(this.navParams.get('name'), this.navParams.get('description'));
  }

  contraceptiveInfo(name, description) {
    this.contraceptive_name = name;
    this.contraceptive_description = description;
  }
}





@Component({
  selector: 'start-assesment',
  templateUrl: 'start-assesment.html',
})

export class StartPage {
  contraceptive_name : string;
  contraceptive_description : string;
  contraceptive_id: string;


  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

  startAssesment() {
    this.navCtrl.push(AssesmentPage, {id: this.navParams.get('id')});
  }

}