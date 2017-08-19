import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../../pages/login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('contraceptive id', this.navParams.get('id'));
    console.log('contraceptive name', this.navParams.get('name'));
  }

}
