import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {

  }

  getContraceptive() {
    this.navCtrl.push(ContraceptivePage)
  }

  askHealthProvider() {
    this.navCtrl.push(ContraceptivePage)
  }

}
