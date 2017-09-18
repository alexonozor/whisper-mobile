import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { LoginPage } from '../../pages/login/login'
import { AuthenticationProvider } from '../../providers/authentication/authentication';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  rootPage: any = HomePage;
  constructor(
    public navCtrl: NavController,
    public menuCtlr: MenuController,
    public _authService: AuthenticationProvider) {

  }

  ionViewDidLoad() {
    console.log('current page ', this.navCtrl.getActive().name);
    console.log('is logged in? ', this._authService.loggedIn());
  }

  getContraceptive() {
    if (this._authService.loggedIn()) {
      this.navCtrl.push(ContraceptivePage);
    }else{
      this.navCtrl.push(LoginPage);
    }
  }

  askHealthProvider() {
    this.navCtrl.push(ContraceptivePage)
  }
}
