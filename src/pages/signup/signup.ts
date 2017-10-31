import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
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
  public backgroundImage = 'assets/img/login-bg.jpg';

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
    public _userService: UserProvider,
    public _authService: AuthenticationProvider,
    public formBuilder: FormBuilder) {
    this.createForm();
  }


  doSignup() {
    this.loading = true;
    // Attempt to login in through our User service
    console.log('signup value ', this.form);
    this._userService.signup(this.form.value).subscribe((resp) => {
      if (resp.success) {
        this.loading = false;
        this._authService.saveToken('token', resp.token)
          this.navCtrl.push(HomePage)
      } else {
        // errors you can handle it later
        // Unable to sign up
        this.loading = false;
        this.signupErrorString = resp.message.message;
        console.log('signup error ', this.signupErrorString);
        let toast = this.toastCtrl.create({
          message: this.signupErrorString,
          duration: 3000,
          position: 'top'
        });
        toast.present();
        console.log('form on failure ', this.form);
      }
    }, (err) => {
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      'firstName': ['', Validators.required],
      'lastName':['', Validators.required],
      'userName': ['', Validators.required],
      'dateOfBirth': ['', Validators.required],
      'password': ['', Validators.required],
      'contact': this.formBuilder.group({
        'email': ['', Validators.required],
        'address': ['', Validators.required]
      })
    });
  }

  goToLogin() {
    this.navCtrl.push(LoginPage);
  }
}
