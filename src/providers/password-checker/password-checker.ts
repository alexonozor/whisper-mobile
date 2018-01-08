import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class PasswordCheckerProvider {

  public message;
  public passwordChecker: Object;
  
  constructor(public http: Http) {
  }

  checker(value) {
    if(value == " ") {
      this.passwordChecker = {
        message :  "Password can't be blank",
        error: true
      } 
			return this.passwordChecker;
    }
    
    if(value.length < 6) {
      this.passwordChecker = {
        message :  "Password can't be blank",
        error: true
      } 
			return this.passwordChecker;
		}
    
    if (value.length >= 6) {
      this.passwordChecker = {
        message :  "good enough",
        error: false
      } 
			return this.passwordChecker;
    }
  }

}
