import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController, NavController, ActionSheetController,  NavParams, ToastController } from 'ionic-angular';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { LoginPage } from '../login/login';
import { AssesmentResponsePage } from '../assesment/assesment-response/assesment-response';

@IonicPage()
@Component({
  selector: 'page-user-assesments',
  templateUrl: 'user-assesments.html',
})
export class UserAssesmentsPage {
  userAssesments: Array<any>;
  birthDate: Date;
  user: Array<any>;
  userId: string;
  loaded: boolean = false;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public _assesmentService: AssesmentProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController
    ) {
  }

  ionViewDidLoad() {
    this.getUser();
  }

  getUser() {
    this.user = this._authService.currentUser();
    this.getUserDetails(this.user);
  }

  getUserDetails(user) {
    this.birthDate = new Date(user.dateOfBirth);
    this.userId = user._id;
    this.getUserAssesment(this.userId);
  }

  getUserAssesment(user_id) {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.gif" />'
    });

    loading.present();

    this._assesmentService.getAssementResponses(user_id)
    .subscribe((resp) => {

      if (resp.success && resp.status == 200) {
        this.loaded = true;
        loading.dismiss();
        this.userAssesments = resp.responses;
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

        this.navCtrl.setRoot(LoginPage).then(() => {
            this.navCtrl.popToRoot();
        });
      }
    })
  }


  startConversation(response) {
    // we need a loader
    let params = { 
      'startedBy': response.user, 
       'assessmentResponse': response._id,  
       'users': [ response.user ], 
       'messages': [],
       'createdAt': Date.now() 
    };

    this._assesmentService.startAssessmentConversation(params)
    .subscribe((resp) => {
      if (resp.success) {
        this.updateAssesmentResponse(response._id, { hasConversation: true, conversation: resp.responseId })
      }
    }, err => {
      //toaster is fyn for err don't for get to dismiss loader
    })

  }

  updateAssesmentResponse(id, params) {
    this._assesmentService.updateResponse(id, params)
    .subscribe((resp) => {
      if (resp.success) {
        this.navCtrl.push(AssesmentResponsePage, { conversationId: params.conversation });        
      }
    }, err => {
      // caught errors
    })
  }

  openConversation(conversationId) {
     this.navCtrl.push(AssesmentResponsePage, { conversationId: conversationId });    
  }

  deleteAssessmentResponse(index, id) {
    let confirmDelete = confirm('Are you sure you want to delete?');
    if (confirmDelete) {
      this.userAssesments.splice(index, 1)
      this._assesmentService.deleteAssementResponse(id)
      .subscribe((resp) => {
        if (resp.success) {
          // toast
        } else {
          //
        }
      }, err => {
        // handle errors
      })
    }
  }

  viewResponseInfo(assessmentResponse) {
    let profileModal = this.modalCtrl.create(ResponseInfoPage, {response: assessmentResponse});

    profileModal.present();
  }

  openOptions(assessmentResponse, index?) {
    var startConvesationOrOpen = (assessmentResponse.hasConversation)? "Open Conversation" : "Start Conversation" 
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Option',
      buttons: [
        {
          text: startConvesationOrOpen,
          role: 'destructive',
          handler: () => {
            if (assessmentResponse.hasConversation) {
              this.openConversation(assessmentResponse.conversation);
            } else {
              this.startConversation(assessmentResponse);
            }
          }
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.deleteAssessmentResponse(index, assessmentResponse._id);
          }
        },
        {
          text: 'Response info',
          role: 'destructive',
          handler: () => {
            this.viewResponseInfo(assessmentResponse)
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }
  
}


@Component({
  selector: 'page-response-info',
  templateUrl: 'response-info.html',
})

export class ResponseInfoPage {
 public response = {};
 constructor(params: NavParams) {
  this.response = params.get('response');
 }

}
