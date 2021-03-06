import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { AuthHttp } from 'angular2-jwt';
import { Observable } from 'rxjs/Rx';
import { BaseurlProvider } from '../baseurl/baseurl';
import { AuthenticationProvider } from '../authentication/authentication';
import { Socket } from 'ng-socket-io';
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
      public _authService: AuthenticationProvider,
      private socket: Socket
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

  updateResponse(id: string, params, updatingShippingForm = false, reOrder = false) : Observable<any> {
    return this.http.put(`${this.host}/update-assessment-responses/${id}?updatingShippingForm=${updatingShippingForm}&reOrder=${reOrder}`, params)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  getAssementResponses(id: string, eligability) : Observable<any> {
    return this.authHttp.get(`${this.host}/user-assessment-responses/${id}?isEligable=${eligability}`)
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

  sendResponsesMessage(params) {
    this.socket.emit("message", params);
    return this.authHttp.post(`${this.host}/messages`, params)
      .map((res:Response) => res.json())
      .catch((error:any) => Observable.throw(error.json().error || 'server error'));
  }

  connectToroom(id) {
    this.socket.emit('room', id);
  }

  getMessages() {
    let observable = new Observable<any>(observer => {
      this.socket.on('message', (data) => {
     
        observer.next(data);    
      });
      return () => {
        this.socket.disconnect();
      };  
    })     
    return observable;
  }  

}
