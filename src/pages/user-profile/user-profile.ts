import { Component } from '@angular/core';
import { DatePipe, I18nPluralPipe } from '@angular/common';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasicInformationPage } from '../basic-information/basic-information';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@IonicPage()
@Component({
  selector: 'page-user-profile',
  templateUrl: 'user-profile.html',
})
export class UserProfilePage {
  user: Array<any>;
  public firstName: string;
  public lastName: string;
  public birthDate: Date;
  public userBirthDate: Date;
  public userId: string;
  public userAge: Number;
  public ageless: boolean =  false;
  public ageInMonths: Number;
  public ageMapping:
      {[k: string]: string} = {'=0': '', '=1': 'year', 'other': '# years'};
  public monthMapping:
      {[k: string]: string} = {'=0': '', '=1': 'month', 'other': '# months'};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider
    ) {
  }

  ionViewDidLoad() {
    this.getUser();
  }

  getUser() {
    this.user = this._authService.currentUser();
    this.calculateUserAge(this.user);
  }

  calculateUserAge(user){
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.userBirthDate = user.dateOfBirth;
    this.userId = user._id;
    let today = new Date();
    this.birthDate = new Date(user.dateOfBirth);
    this.userAge = today.getFullYear() - this.birthDate.getFullYear();
    if(this.userAge < 1) {
      this.ageless = true;
    }
    this.ageInMonths = today.getMonth() - this.birthDate.getMonth();
    console.log('age in months ', this.ageInMonths);
  }

  goToBasicInfo(){
    console.log('date of birthDate passed ', this.userBirthDate);
    this.navCtrl.push(BasicInformationPage, {
      'firstName': this.firstName,
      'lastName': this.lastName,
      'dateOfBirth': this.userBirthDate,
      'userId': this.userId
    });
  }

}
