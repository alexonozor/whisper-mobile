import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { BaseurlProvider } from '../baseurl/baseurl';
import { AuthenticationProvider } from '../authentication/authentication';

/*
  Generated class for the AssesmentProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AssesmentProvider {
  public host = this._baseUrl.getEnvironmentVariable();
  public token = '';

  constructor(
      public http: Http,
      public authHttp: AuthHttp,
      public _baseUrl: BaseurlProvider,
      public _authService: AuthenticationProvider
  ) { }

  submitAssesment(assesmentParams: any) : Observable<any> {
    return this.http.post(`${this.host}/assessment-responses`, assesmentParams)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  updatAssessmenteResponse(id: number, pharmacyId: number) : Observable<any> {
    return this.http.put(`${this.host}/update-assessment-responses/${id}`, { selectedPharmacy: pharmacyId})
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  updateResponse(id: string, params) : Observable<any> {
    return this.http.put(`${this.host}/update-assessment-responses/${id}`, params)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  getAssementResponses(id: string) : Observable<any> {
    return this.authHttp.get(`${this.host}/user-assessment-responses/${id}`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  getAssementResponsesMessage(id: string) : Observable<any> {
    return this.authHttp.get(`${this.host}/conversation/${id}/messages`)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  deleteAssementResponse(id: string) : Observable<any> {
    return this.authHttp.put(`${this.host}/delete-assessment-responses/${id}`, {})
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  
  startAssessmentConversation(params) : Observable<any> {
    return this.authHttp.post(`${this.host}/create-conversation`, params)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  sendResponsesMessage(params) : Observable<any> {
    return this.authHttp.post(`${this.host}/messages`, params)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }
}
