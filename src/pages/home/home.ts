import { Component } from '@angular/core';
import { MenuController, NavController } from 'ionic-angular';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { LoginPage } from '../../pages/login/login'
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';

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
    public _userService: UserProvider,
    public _authService: AuthenticationProvider) {

  }

  ionViewDidLoad() {
    this._userService.getAdminUsers().subscribe((res) => {
      if (res.success) {
        this._userService.saveAdminUsers(res.users)
      } else {

      }
    }, err => {
      
    })
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
