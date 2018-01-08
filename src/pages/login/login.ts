import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { PasswordCheckerProvider } from '../../providers/password-checker/password-checker';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: boolean = false;
  public backgroundImage = 'assets/img/background.png';
  submitAttempt: boolean = false;    
  EMAIL_REGEXP = /^[a-z0-9!#$%&'*+\/=?^_`{|}~.-]+@[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*$/i;
  password_checker: Object;


  // The account fields for the login form.
  private form = this.formBuilder.group({
    'email': ['', Validators.compose([Validators.required, Validators.pattern(this.EMAIL_REGEXP)])],
    'password': ['', Validators.compose([Validators.required,Validators.minLength(6)]) ]
  });

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider,
    public _passwordChecker: PasswordCheckerProvider
    ) {
  }

  // Attempt to login in through our User service
  doLogin() {
    this.submitAttempt = true;
    let loader = this.loadingCtrl.create({
      spinner: 'show',
      dismissOnPageChange: true,
      showBackdrop: true,
      content: '<img src="assets/img/loader.svg" />',
    });
    loader.present();

    let prev_page = this.navParams.get('prev_page');
    this.loading = true;
    this._authService.login(this.form.value)
    .subscribe((resp) => {
      loader.dismiss();
      if (resp.success) {
        this.loading = false;
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
      loader.dismiss();
      this.loading = false;
      let toast = this.toastCtrl.create({
        message: 'internet error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  passMessage(message) {
    this.password_checker = this._passwordChecker.checker(message);
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }
}
