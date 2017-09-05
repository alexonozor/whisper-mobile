import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public menuCtlr: MenuController) {

  }

  getContraceptive() {
    this.navCtrl.push(ContraceptivePage)
  }

  askHealthProvider() {
    this.navCtrl.push(ContraceptivePage)
  }
}
