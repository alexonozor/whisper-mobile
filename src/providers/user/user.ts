import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { BaseurlProvider } from '../baseurl/baseurl';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

/*
  Generated class for the UserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class UserProvider {
  constructor(public http: Http, public _base_url: BaseurlProvider) {
    
  }
  private host = this._base_url.getEnvironmentVariable();


  signup(accountInfo: any) : Observable<any> {
		return this.http.post(`${this.host}/register`, accountInfo)
			.map((res:Response) => res.json())
			.catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  update(accountInfo: any, id) : Observable<any> {
    return this.http.put(`${this.host}/user/${id}`, accountInfo)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  getUser(id) : Observable<any> {
    return this.http.get(`${this.host}/user/${id}`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

}
