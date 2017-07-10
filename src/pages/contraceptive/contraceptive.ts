import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../../pages/login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

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

}
