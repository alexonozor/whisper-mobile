import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public fb: FormBuilder
    ) {

    this.firstName = navParams.get('firstName');
    this.lastName = navParams.get('lastName');
    this.dob = navParams.get('dateOfBirth');
    console.log('first name ',this.firstName, 'last Name ', this.lastName, 'dateOfBirth', this.dob);
    this.createForm();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BasicInformationPage');
  }

  createForm() {
    this.basicInfoForm = this.fb.group({
      firstName: ['', Validators.required ],
      lastName: ['', Validators.required ],
      dateOfBirth: ['', Validators.required]
    })
  }

}
