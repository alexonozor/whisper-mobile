import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { BaseurlProvider } from '../baseurl/baseurl';
import { AuthenticationProvider } from '../authentication/authentication';


/*
  Generated class for the ContraceptiveProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class ContraceptiveProvider {
  public host = this._baseUrl.getEnvironmentVariable();
  public token = '';

  constructor(
      public http: Http,
      public authHttp: AuthHttp,
      public _baseUrl: BaseurlProvider,
      public _authService: AuthenticationProvider
  ) { }

  getAll(): Observable<any> {
    return this.authHttp.get(`${this.host}/contraceptives`)
			.map((res:Response) => res.json())
			.catch((error:any) => Observable.throw(error || 'server error'));
  }

  getContraceptive(id: number): Observable<any> {
    return this.authHttp.get(`${this.host}/contraceptive/${id}`)
			.map((res:Response) => res.json())
			.catch((error:any) => Observable.throw(error || 'server error'));
  }

  getAssesment(id: string): Observable<any> {
    return this.authHttp.get(`${this.host}/contraceptive/${id}/assessments`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'server error'));
  }

  getAdminAssesment(id: string): Observable<any> {
    return this.authHttp.get(`${this.host}/admin-assessment/${id}/answers`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error || 'server error'));
  }
}
