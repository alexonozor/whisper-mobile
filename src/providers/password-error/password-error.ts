import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class PasswordErrorProvider {
  public message;
  constructor(public http: Http) {
    console.log('Hello PasswordErrorProvider Provider');
  }

  errorMessenger(value) {
    if(value.length <= 5) {
			return this.message =  "too short";
		}
		else if (value.length == 6) {
			return this.message = "fairly strong";
		}

		else if (value.length > 8) {
			return this.message = "strong password";
		}
		
		else if (value.length > 10) {
			return this.message = "strong password";
		}
  }

}
