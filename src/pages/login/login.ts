import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  private form = this.formBuilder.group({
    'email': ['', Validators.required],
    'password': ['', Validators.required]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider
    ) {
    console.log("previous page: ", this.navParams.get('prev_page'));
  }

  // Attempt to login in through our User service
  doLogin() {
    this._authService.login(this.form.value)
    .subscribe((resp) => {
      if (resp.success) {
        let prev_page= this.navParams.get('prev_page');
        console.log('user object ', resp);
        if( prev_page != undefined || prev_page != ""){
          this.navCtrl.push(prev_page);
        }
        else {
          this.navCtrl.push(HomePage);
        }
        this._authService.saveToken('token', resp.token);
        this._authService.saveUser(resp.user);
      } else {
          // Unable to log in
        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        }
    }, (err) => {
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
}
