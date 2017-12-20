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
  public currentUser: any;
  public submited: boolean = false;
  public userId: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public fb: FormBuilder,
    public _userService: UserProvider
    ) {
    this.currentUser = this._authService.currentUser();
    this.createForm();
  }

  ionViewDidLoad() {

  }
  

  createForm() {
    this.basicInfoForm = this.fb.group({
      firstName: ["", Validators.required ],
      userName: ["", Validators.required],
      lastName: ["", Validators.required ],
      email: ["", Validators.required ],
      gender: ["", Validators.required ],
      dateOfBirth: ["", Validators.required ],
      accountType: [{value: '', disabled: true} ],
    })
  }


  updateUser() {
    this.submited = true;
    this._userService.update(this.basicInfoForm.value, this.currentUser._id)
    .subscribe((res) => {
      if (res.success) {
        // this.submited = false;
        this._authService.saveUser(res.user);
      } else {
      }
    }, err => {
      // caught error
      console.log('an error occurred');
    })
  }

}
