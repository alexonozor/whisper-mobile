import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PasswordErrorProvider {
  public message;
  constructor(public http: Http) {
  }

  errorMessenger(value) {
    if(value.length < 6) {
      console.log('length less than 6 ', value.length);
			return this.message =  "too short";
		}
    
    if (value.length == 6) {
      console.log('equal to 6 ', value.length);
			return this.message = "fairly strong";
    }
    
    if (value.length > 6) {
      console.log('greater than 6 ', value.length);
			return this.message = "strong enoough";
    }

  }

}
