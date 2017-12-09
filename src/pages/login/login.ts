import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { ContraceptivePage } from '../../pages/contraceptive/contraceptive';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';
import { Subscription } from 'rxjs/Subscription';;

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  loading: boolean = false;
  subscription: Subscription;
  public backgroundImage = 'assets/img/background.png';
  loader : any = this.loadingCtrl.create({
    spinner: 'show',
    showBackdrop: false,
    content: '<img src="assets/img/auth-loader.svg" />',
  });

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

  showLoader() {
    this.loader.present();
  }

  dismissLoader() {
    this.loader.dismiss();
  }

  toaster(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  // Attempt to login in through our User service
  doLogin() {
    let prev_page = this.navParams.get('prev_page');
    this.loading = true;
    this._authService.login(this.form.value)
    .subscribe((resp) => {
      this.showLoader();
      if (resp.success) {
        this.dismissLoader();
        this.loading = false;
        this.navCtrl.setRoot(HomePage);
        this._authService.saveToken('token', resp.token);
        this._authService.saveUser(resp.user);
      } else {
        // Unable to log in
        this.loading = false;
        this.toaster(resp.message);
        }
    }, (err) => {
      // Unable to log in
      this.loading = false;
      this.toaster('An error occurred');
    });
    
  }

  goToSignup() {
    this.navCtrl.push(SignupPage);
  }
}
