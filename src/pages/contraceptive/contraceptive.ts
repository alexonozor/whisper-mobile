import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../login/login';
import { AssesmentPage } from '../assesment/assesment';

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
    this.getAllContraceptive();
  }

  getAllContraceptive() {
    let prev_page = this.navCtrl.getActive().name;
    console.log('current page ', prev_page);

    this._authService.tokenSubscription()
      let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: ''
    });
   loading.present();

  this._contraceptiveService.getAll()
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

        // this.navCtrl.setRoot(LoginPage).then(() => {
        //     this.navCtrl.popToRoot();
        // });
        this.navCtrl.setRoot(LoginPage,{prev_page: prev_page});
     }
   })
  }

  goToAssesment(id,name,appointment) {
    this.navCtrl.push(StartPage, {id: id, name: name, appointment: appointment});
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

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {}

  startAssesment() {
    this.navCtrl.push(AssesmentPage, {
      id: this.navParams.get('id'),
      name: this.navParams.get('name'),
      appointment: this.navParams.get('appointment')
    });
  }

}