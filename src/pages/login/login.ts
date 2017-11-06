import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: boolean = false;
  public backgroundImage = 'assets/img/background.png';

  // The account fields for the login form.
  private form = this.formBuilder.group({
    'email': ['', Validators.required],
    'password': ['', Validators.required]
  });

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider
    ) {
  }

  // Attempt to login in through our User service
  doLogin() {
    let loader = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/auth-loader.svg" />',
    });
    loader.present();

    let prev_page = this.navParams.get('prev_page');
    this.loading = true;
    this._authService.login(this.form.value)
    .subscribe((resp) => {
      loader.dismiss();
      if (resp.success) {
        this.loading = false;
        // this takes you to previous page before login page was pushed
        // if( prev_page != undefined || prev_page != "") {
        //   if(prev_page.name == "HomePage") {
        //     this.navCtrl.setRoot(prev_page);
        //   }else {
        //     this.navCtrl.push(prev_page);
        //   }
        // }
        // else {
        //   this.navCtrl.push(HomePage);
        // }
        this.navCtrl.setRoot(HomePage);
        this._authService.saveToken('token', resp.token);
        this._authService.saveUser(resp.user);
      } else {
        // Unable to log in
        this.loading = false;

        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        }
    }, (err) => {
      // Unable to log in
      this.loading = false;
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }
}
