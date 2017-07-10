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
            case'iplandev.promasidor.com':
                data = {
                    endPoint: 'http://iplandev.promasidor.com:8080'
                };
                break;
             case 'localhost':
                data = {
                    endPoint: 'http://localhost:7777'
                };
                break;

            default:
                data = {
                    endPoint: 'http://localhost:7777'
                };
        }
        return data['endPoint'];
    }

}