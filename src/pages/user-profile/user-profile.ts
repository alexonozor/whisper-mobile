import { Component } from '@angular/core';
import { DatePipe, I18nPluralPipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { BasicInformationPage } from '../user-profile/basic-information/basic-information';
import { SettingsPage } from '../settings/settings';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserProvider } from '../../providers/user/user';

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
  public basicInfoForm: FormGroup;
  public currentUser: any;
  public submited: boolean = false;
  loading : any;
  public ageMapping:
      {[k: string]: string} = {'=0': '', '=1': 'year', 'other': '# years'};
  public monthMapping:
      {[k: string]: string} = {'=0': '', '=1': 'month', 'other': '# months'};


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public fb: FormBuilder,
    public _userService: UserProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController
  ) {
    this.currentUser = this._authService.currentUser();
    this.createForm()
  }

  ionViewDidLoad() {
    
  }

  loader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loading.present();
  }

  dismissLoader() { 
    this.loading.dismiss();
  } 

  createForm() {
    this.basicInfoForm = this.fb.group({
      firstName: [this.currentUser.firstName, Validators.required ],
      userName: [this.currentUser.userName, Validators.required],
      lastName: [this.currentUser.lastName, Validators.required ],
      email: [this.currentUser.email, Validators.required ],
      gender: [this.currentUser.gender, Validators.required ],
      dateOfBirth: [this.currentUser.dateOfBirth, Validators.required ]
    })
  }

  goToBasicInfo() {
    this.navCtrl.push(BasicInformationPage, {
      'firstName': this.firstName,
      'lastName': this.lastName,
      // 'dateOfBirth': this.userBirthDate,
      'userId': this.userId
    });
  }

  goToSettings() {
    this.navCtrl.push(SettingsPage);
  }


  updateUser() {
    this.loader()
    this._userService.update(this.basicInfoForm.value, this.currentUser._id)
    .subscribe((res) => {
      if (res.success) {
        this.dismissLoader()
        this._authService.saveUser(res.user);
        let toast = this.toastCtrl.create({
          message: 'Updated!',
          duration: 3000,
          position: 'top'
        });
        toast.present();
       
      } else {
      }
    }, err => {
      this.dismissLoader()
      // caught error
      let toast = this.toastCtrl.create({
        message: 'An error occurred',
        duration: 3000,
        position: 'top'
      });
      toast.present();
     
    })
  }

}
