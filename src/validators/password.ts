import { FormControl } from '@angular/forms';
 
export class PasswordValidator {
 
    static isValid(control: FormControl): any {
		// console.log('control ', control);
		// console.log('value length ', control.value.length );
		if(control.value.length <= 3) {
			// "too short": true
			control['message'] =  "too short"
		}
		else {
			control['message'] = "";
		}

    }
 
}