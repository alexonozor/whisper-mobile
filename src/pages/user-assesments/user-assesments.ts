import { Component } from '@angular/core';
import { IonicPage, ModalController, LoadingController, NavController, ActionSheetController,  NavParams, ToastController } from 'ionic-angular';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { NotificationProvider } from '../../providers/notification/notification';
import { LoginPage } from '../login/login';
import { AssesmentResponsePage } from '../assesment/assesment-response/assesment-response';
import { ContraceptivePage } from   '../contraceptive/contraceptive';
import { AssesmentPage } from '../assesment/assesment';

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
  none_found: boolean = false;
  assessment: Boolean = true;

  constructor(
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public _authService: AuthenticationProvider,
    public _assesmentService: AssesmentProvider,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public _notification: NotificationProvider,
    public _userService: UserProvider
    ) {
  }

  ionViewDidLoad() {
    this.getUser()
  } 

  getContraceptive() {
    this.navCtrl.push(ContraceptivePage);
  }

  getUser() {
    this.user = this._authService.currentUser();
    this.getUserDetails(this.user);
  }

  getUserDetails(user) {
    this.birthDate = new Date(user.dateOfBirth);
    this.userId = user._id;
    this.getUserAssesment(this.userId, this.assessment);
  }

  getUserAssesment(user_id, assementType) {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />'
    });

    loading.present();

    this._assesmentService.getAssementResponses(user_id, assementType)
    .subscribe((resp) => {

      if (resp.success && resp.status == 200) {
        loading.dismiss();
        this.userAssesments = resp.responses;
        if( this.userAssesments.length > 0){
          this.loaded = true;
          this.none_found = false;
        } else {
          this.none_found = true;
        }
      }
    }, (err) => {

      
      loading.dismiss();
          // Unable to log in
        let toast = this.toastCtrl.create({
          message: "Please check your internet connection",
          duration: 3000,
          position: 'top'
        });
        toast.present();
        this.navCtrl.pop()
    })
  }


  reOrderORRetake(assessment) {
    if (assessment.success) {
      // reorder
      let loading = this.loadingCtrl.create({
        spinner: 'show',
        showBackdrop: true,
        content: '<img src="assets/img/loader.svg" />'
      });
  
      loading.present();
      this.submitAssesment(assessment, loading);
    } else {
      // retake
      this.navCtrl.push(AssesmentPage, { contraceptive: assessment.contraceptive });  
    }
  }

  submitAssesment(assessment, loading) {
    this._assesmentService.updateResponse(assessment._id, {
      reOrderedAt: Date.now(),
  }, false, true)
    .subscribe((resp) => {
      if (resp.success) {
        loading.dismiss();
        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
      // Unable to submit assesment
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
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
        this.updateAssesmentResponse(response._id, { hasConversation: true, conversation: resp.responseId });
        this._userService.allAdmin().forEach((el, index) => {
          this._notification.create(
            { 
              sender: params.startedBy, 
              receiver: el._id, 
              notification_type_id: resp.responseId,
              notification_type: 'openConversation',
              content: 'starts a conversation on an assesment'
            }
          ).subscribe((res) => {
            if (res.success) {
            } else {

            }
          })
        })
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

