import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { LoginPage } from '../login/login';
import { AssesmentPage } from '../assesment/assesment';
import { Subscription} from 'rxjs/Subscription'

@IonicPage()
@Component({
  selector: 'page-contraceptive',
  templateUrl: 'contraceptive.html',
})
export class ContraceptivePage {
  contraceptives: Array<{id: string, title: string, description: string}>
  assesment: Array<{id: string, question: string, answer: {} }> = [];
  mocked_contraceptives: Array<{}> = [];
  subscription: Subscription;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController,
    public _contraceptiveService: ContraceptiveProvider,
    public _authService: AuthenticationProvider) {
  }


  ionViewDidLoad() {
    this.getAllContraceptive();
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  getAllContraceptive() {
    let prev_page = this.navCtrl.getActive().name;

    this._authService.tokenSubscription()
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    loading.present();

    this.subscription = this._contraceptiveService.getAll()
      .subscribe((resp) => {
          if (resp.success && resp.status == 200) {
            loading.dismiss();
            this.contraceptives = resp.contraceptives;
            this.insertRelatedContraceptives(this.contraceptives);
          } else {
          }
        }, (err) => {
        loading.dismiss();
        if (err.status == 401) {
          // Unable to log in
          let toast = this.toastCtrl.create({
            message: err.statusText,
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.setRoot(LoginPage,{prev_page: prev_page});
        }
      })
  }

  insertRelatedContraceptives(contraceptives){
    contraceptives.forEach((el, i) => {
      switch(el._id) {
        case "5996d1b0d8cd190011805392":
          el['related-contraceptives'] = [
            {
              'name': "Condom",
              '_id': "599507cc2a3cc400114aafb7",
              'appointment': false,
              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Daily Contraceptive Pills",
              '_id': "5996d58cd8cd19001180539e",
              'appointment': false,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Contraceptive Injection",
              '_id':"5996d804d8cd1900118053a2",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Contraceptive implants",
              '_id': "5996ddacd8cd1900118053b0",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
               'name': "Emergency Pills",
               '_id': "5996d3c8d8cd190011805399",
               'appointment': false,

               'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
          break;

        case "5996d58cd8cd19001180539e":
          el['related-contraceptives'] = [
            {
              'name': "Diaphragm and gel",
              '_id': "5996d1b0d8cd190011805392",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
          break;

        case "599507cc2a3cc400114aafb7":
          el['related-contraceptives'] = [
            {
              'name': "Condom",
              '_id': "599507cc2a3cc400114aafb7",
              'appointment': false,
              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Diaphragm and gel",
              '_id': "5996d1b0d8cd190011805392",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Daily Contraceptive Pills",
              '_id': "5996d58cd8cd19001180539e",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Contraceptive Injection",
              '_id':"5996d804d8cd1900118053a2",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
              'name': "Contraceptive implants",
              '_id': "5996ddacd8cd1900118053b0",
              'appointment': true,

              'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            },
            {
               'name': "Emergency Pills",
               '_id': "5996d3c8d8cd190011805399",
               'appointment': true,

               'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
          break;

        case "5996d3c8d8cd190011805399":
          el['related-contraceptives'] = [
            {
               'name': "Emergency Pills",
               '_id': "5996d3c8d8cd190011805399",
               'appointment': true,

               'related-contraceptives': [
                {
                  'name': "Daily Contraceptive Pills",
                  '_id': "5996d58cd8cd19001180539e",
                  'appointment': false,
                  'related-contraceptives': [
                    {
                      'name': "Contraceptive Injection",
                      '_id':"5996d804d8cd1900118053a2",
                      'appointment': true,
                      'related-contraceptives': [
                        {
                          'name': "Contraceptive Injection",
                          '_id':"5996d804d8cd1900118053a2",
                          'appointment': true,
                          'related-contraceptives':[]
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
          break;

        case "5996d804d8cd1900118053a2":
          el['related-contraceptives'] = []
          break;

        case "5996ddacd8cd1900118053b0":
          el['related-contraceptives'] = []
          break;

        default:
          console.log(" i\'m the defaulter");

        console.log('mocked contraceptives ', this.contraceptives)
      }
    })
    this.contraceptives = contraceptives;

  }


  goToAssesment(id,name,appointment,contraceptive) {
    this.navCtrl.push(StartPage, {id: id, name: name, appointment: appointment, related: contraceptive});
  }

  loadAssesments(id, name) {
    let getAss = this._contraceptiveService.getAssesment(id)
    .subscribe((resp) => {
     if (resp.success && resp.status == 200) {
       this.assesment = resp.assessments
     } else {
     }
    }, (err) => {
      if (err.status == 401) {
          // Unable to log in
        let toast = this.toastCtrl.create({
          message: err.statusText,
          duration: 3000,
          position: 'top'
        });
        toast.present();

        this.navCtrl.setRoot(LoginPage).then(() => {
            this.navCtrl.popToRoot();
        });
      }
    })
    this.subscription.add(getAss)
  }

  contraceptiveInfo(name, description){
    this.navCtrl.push(ContraceptiveDescPage, { name: name, description: description });
  }

}

@Component({
  selector: 'page-contraceptive-desc',
  templateUrl: 'contraceptive_desc.html',
})

export class ContraceptiveDescPage {
  contraceptive_name : string;
  contraceptive_description : string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider) {
  }

  ionViewDidLoad() {
    this.contraceptiveInfo(this.navParams.get('name'), this.navParams.get('description'));
    this.getUser();
  }

  getUser() {
    console.log('get current user ', this._authService.currentUser() );
  }

  contraceptiveInfo(name, description) {
    this.contraceptive_name = name;
    this.contraceptive_description = description;
  }
}





@Component({
  selector: 'start-assesment',
  templateUrl: 'start-assesment.html',
})

export class StartPage {
  username: string;

  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {}

  startAssesment() {
    this.navCtrl.push(AssesmentPage, {
      id: this.navParams.get('id'),
      name: this.navParams.get('name'),
      appointment: this.navParams.get('appointment'),
      related: this.navParams.get('related')
    });
  }

}