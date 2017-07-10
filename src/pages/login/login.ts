import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
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
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider
    ) {
  }

  // Attempt to login in through our User service
  doLogin() {
    this._authService.login(this.form.value)
    .subscribe((resp) => {
      if (resp.success) {
        this._authService.saveToken('token', resp.token);
        this.navCtrl.push(HomePage)
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
