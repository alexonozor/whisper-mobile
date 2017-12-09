import { Component } from '@angular/core';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { UserProvider } from '../../providers/user/user';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})

export class SignupPage {
  public backgroundImage = 'assets/img/background.png';
  subscription: Subscription;
  loading: boolean = false;
  loadingIcon: any;

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

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  toaster(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  loader() {
    this.loadingIcon = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loadingIcon.present();
  }

  dismissLoader() {
    this.loadingIcon.dismiss();
  }

  doSignup() {
    this.loader()
    this.loading = true;
    // Attempt to login in through our User service
    this.subscription = this._userService.signup(this.form.value).subscribe((resp) => {
      this.dismissLoader();
      if (resp.success) {
        this.loading = false;
        this._authService.saveToken('token', resp.token);
        this._authService.saveUser(resp.user);
        this.navCtrl.setRoot(HomePage);
      } else {
        // Unable to sign up
        this.loading = false;
        this.toaster('Sorry, an error occurred');
      }
    }, (err) => {
      this.loading = false;
      this.toaster('Sorry, an error occurred');      
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
