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
      title: 'Dream\'s Adventure',
      imageUrl: 'assets/img/slides/wishlist-1.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'For the Weekend',
      imageUrl: 'assets/img/slides/wishlist-2.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'Family Time',
      imageUrl: 'assets/img/slides/wishlist-3.jpg',
      description: 'Take a look at our amazing options',
    },
    {
      title: 'My Trip',
      imageUrl: 'assets/img/slides/wishlist-4.jpg',
      description: 'Take a look at our amazing options',
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
