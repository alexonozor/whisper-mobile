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
  public backgroundImage = 'assets/img/background.png';

  constructor(
    public navCtrl: NavController,
    public menuCtlr: MenuController,
    public _authService: AuthenticationProvider) {

  }

  ionViewDidLoad() {
  }

  getContraceptive() {
    if (this._authService.currentUser() != null) {
      this.navCtrl.push(ContraceptivePage);
    }else{
      this.navCtrl.push(LoginPage, {prev_page: this.navCtrl.getActive()});
    }
  }

  askHealthProvider() {
    this.navCtrl.push(ContraceptivePage)
  }
}
