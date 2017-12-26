import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  public backgroundImage = 'assets/img/background.png';

  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  
  loading: boolean = false;

  // Our translated text strings
  private signupErrorString: string;
  form : FormGroup;

  constructor(
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public _userService: UserProvider,
    public _authService: AuthenticationProvider,
    public formBuilder: FormBuilder) {
    this.createForm();
  }

  doSignup() {
    let loader = this.loadingCtrl.create({
      spinner: 'show',
      dismissOnPageChange: true,
      showBackdrop: true,
      content: '<img src="assets/img/loader.svg" />',
    });
    loader.present();

    this.loading = true;
    // Attempt to login in through our User service
    this._userService.signup(this.form.value).subscribe((resp) => {
      loader.dismiss();
      if (resp.success) {
        this.loading = false;
        this._authService.saveToken('token', resp.token);
        this._authService.saveUser(resp.user);
        this.navCtrl.setRoot(HomePage);
      } else {
        // errors you can handle it later
        // Unable to sign up
        this.loading = false;
        // this.signupErrorString = resp.message.errmsg;
        let toast = this.toastCtrl.create({
          message: 'Sorry, an error occurred',
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
      this.loading = false;
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      'accountType': ['Member', Validators.required],
      'firstName': ['', Validators.required],
      'lastName':['', Validators.required],
      'password': ['', Validators.required],
      'email': ['', Validators.required],
    });
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }
}
