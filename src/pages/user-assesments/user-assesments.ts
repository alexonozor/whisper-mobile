import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-user-assesments',
  templateUrl: 'user-assesments.html',
})
export class UserAssesmentsPage {
  userAssesments: Array<any>;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public _assesmentService: AssesmentProvider,
    public toastCtrl: ToastController
    ) {
  }

  ionViewDidLoad() {
    this.getUserAssesment();
  }

  getUserAssesment() {
    this._assesmentService.getAssementResponses()
    .subscribe((resp) => {
      console.log('response ', resp);
      if (resp.success && resp.status == 200) {
        this.userAssesments = resp.responses;
        console.log('user assesments ', this.userAssesments);
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

}
