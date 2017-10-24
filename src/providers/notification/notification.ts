import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';;
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { BaseurlProvider } from '../baseurl/baseurl';
import { AuthenticationProvider } from '../authentication/authentication'


/*
  Generated class for the NotificationProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class NotificationProvider {

  public host = this._baseUrl.getEnvironmentVariable();
  public token = '';

  constructor(
      public http: Http,
      public authHttp: AuthHttp,
      public _baseUrl: BaseurlProvider,
      public _authService: AuthenticationProvider
  ) { }


  create(params): Observable<any> {
    return this.authHttp.post(`${this.host}/notifications`, params)
			.map((res:Response) => res.json())
			.catch((error:any) => Observable.throw(error || 'server error'));
  }

  getUserNotifications(userId): Observable<any> {
    return this.authHttp.get(`${this.host}/getuser-notifications/${userId}`)
    .map((res:Response) => res.json())
    .catch((error:any) => Observable.throw(error || 'server error'));
  }



}
