import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the ContraceptiveInfoPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contraceptive-info',
  templateUrl: 'contraceptive-info.html',
})
export class ContraceptiveInfoPage {
  contraceptive: Object = {};

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController) 
    {
      this.contraceptive = navParams.get('contraceptive');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContraceptiveInfoPage');
  }
  

  dismiss() {
    this.viewCtrl.dismiss();
  }

}
