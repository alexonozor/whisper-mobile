import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from '../../../providers/user/user';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public fb: FormBuilder,
    public _userService: UserProvider
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

  updateUser() {
    this.submited = true;
    this._userService.update(this.basicInfoForm.value, this.userId)
    .subscribe((res) => {
      if (res.success) {
        // this.submited = false;
        console.log('user profile updated');
      } else {
      }
    }, err => {
      // caught error
      console.log('an error occurred');
    })
  }

}
