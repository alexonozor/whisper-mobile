import { Injectable } from '@angular/core';

@Injectable()
export class BaseurlProvider {

  constructor() { }

  getEnvironmentVariable() {
        var environment:string;
        var data = {};
        // environment = "iplandev.promasidor.com";
        environment = window.location.hostname;
        switch (environment) {
            case'https://whisper-admin.herokuapp.com':
              data = {
                endPoint: 'https://whisper-admin.herokuapp.com'
              };
              break;
           case 'localhost':
              data = {
                endPoint: 'http://localhost:7777'
              };
              break;

            default:
              data = {
                endPoint: 'https://whisper-admin.herokuapp.com'
              };
        }
        return data['endPoint'];
    }

}