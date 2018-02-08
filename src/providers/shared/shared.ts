import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { BaseurlProvider } from '../baseurl/baseurl';
import { AuthenticationProvider } from '../authentication/authentication';


/*
  Generated class for the SharedProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SharedProvider {

  public host = this._baseUrl.getEnvironmentVariable();
  public token = '';

  constructor(
      public http: Http,
      public authHttp: AuthHttp,
      public _baseUrl: BaseurlProvider,
      public _authService: AuthenticationProvider
  ) { }

  getUserThreads(userId: string): Observable<any> {
    return this.authHttp.get(`${this.host}/user-threads/${userId}`)
			.map((res:Response) => res.json())
			.catch((error:any) => Observable.throw(error || 'server error'));
  }

  createMessageThread(reciepaint, currentUser, subject) {
    return this.http.post(`${this.host}/threads`, {startedBy: currentUser, reciepaint: reciepaint, subject: subject})
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'server error'));
  }


  createThreadMessage(params) {
    return this.http.post(`${this.host}/threads-message`, params)
    .map((res: Response) => res.json())
    .catch((error: any) => Observable.throw(error.json().error || 'server error'));
  }
}
