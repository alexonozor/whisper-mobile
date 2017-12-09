import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';
import { Subscription} from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-basic-information',
  templateUrl: 'basic-information.html',
})
export class BasicInformationPage {
  public basicInfoForm: FormGroup;
  public firstName: string;
  public lastName: string;
  public dob: Date;
  public submited: boolean = false;
  public userId: string;
  subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public fb: FormBuilder,
    public _userService: UserProvider,
    public toastCtrl: ToastController
    ) {
    this.firstName = navParams.get('firstName');
    this.lastName = navParams.get('lastName');
    this.userId = navParams.get('userId')
    this.createForm();
  }

  ionViewDidLoad() {
  }

  createForm() {
    this.basicInfoForm = this.fb.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
    })
  }

  toaster(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  updateUser() {
    this.submited = true;
    this._userService.update(this.basicInfoForm.value, this.userId)
    .subscribe((res) => {
      if (res.success) {
        this.submited = true;
      } else {
        this.toaster('An error occurred');
      }
    }, err => {
      this.toaster('An error occurred');
    })
  }
}
