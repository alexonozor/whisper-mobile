import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  @ViewChild('slider') slider: Slides;
  slideIndex = 0;
  slides = [
    {
      title: '',
      imageUrl: 'assets/img/slides/1.jpg',
      description: '',
    },
    {
      title: '',
      imageUrl: 'assets/img/slides/2.jpg',
      description: '',
    },
    {
      title: '',
      imageUrl: 'assets/img/slides/3.jpg',
      description: '',
    }
  ];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider) {
  }


  skipIntro() {
    console.log("is user logged in?", this._authService.loggedIn());
    if(this._authService.loggedIn()) {
      this.navCtrl.setRoot(HomePage);
    }
    else{
      this.navCtrl.push(LoginPage)
    }
  }

  onSlideChanged() {
    this.slideIndex = this.slider.getActiveIndex();
    console.log('Slide changed! Current index is', this.slideIndex);
  }

}
