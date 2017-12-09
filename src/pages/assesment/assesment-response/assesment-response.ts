import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AssesmentProvider } from '../../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';
import { Subscription} from 'rxjs/Subscription';

@IonicPage()
@Component({
  selector: 'page-assesment-response',
  templateUrl: 'assesment-response.html',
})
export class AssesmentResponsePage {

  // resizes textarea on keydown
  @ViewChild('myInput') myInput: ElementRef;
  showButton: boolean =  false;
  messageResponse: Array<any> = [];
  conversation: object = {};
  isSender: boolean = false;
  userId: object;
  conversationId: string;
  subscription: Subscription;  

  private form = this.formBuilder.group({
    content: ['', Validators.required],
    conversation: [this.conversationId],
    user: [this._authentication.currentUser()._id],
    createdAt: [Date.now()]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder,
    public _authentication: AuthenticationProvider,
    public _assesmentService: AssesmentProvider) 
  {
    this.conversationId = this.navParams.get('conversationId');
    this.form.patchValue({ conversation: this.conversationId });   
  }

  loading = this.loadingCtrl.create({
    spinner: 'show',
    showBackdrop: false,
    content: '<img src="assets/img/loader.svg" />',
  });

  showLoader() {
    this.loading.present();
  }

  dismissLoader() {
    this.loading.dismiss();
  }

  ionViewDidLoad() {
    this.showLoader();
    this.connectToRoom();
    this.getMessages();
    this._assesmentService.getAssementResponsesMessage(this.conversationId)
    .subscribe((resp) => {
      this.dismissLoader();
      if (resp.success) {
        this.conversation = resp.conversation;
        this.checkSender(resp.conversation.messages);
      }
    }, (err) => {
      let toast = this.toastCtrl.create({
        message: err.statusText,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    })
  }

  ionViewWillLeave() {
    this.subscription.unsubscribe();
  }

  connectToRoom() {
    this._assesmentService.connectToroom(this.conversationId);
  }

  getMessages() {
    this.subscription = this._assesmentService.getMessages().subscribe(message => {
        message['isSender'] = ( message.user == this.userId );
        if (!message.isSender) {
          this.messageResponse.push(message);
        }
      });
  }

  checkSender(messageResponse) {
    this.userId = this._authentication.currentUser()._id;
    messageResponse.forEach((el, i) => {
      el['isSender'] = ( el.user == this.userId )
    })
    this.messageResponse = messageResponse;
  }

  sendMessage() {
    let senderValue = (this.form.value.user == this.userId)
     this.form.value.isSender = true
   
    this.messageResponse.push(this.form.value);
    let sendMessage = this._assesmentService.sendResponsesMessage(this.form.value).subscribe((res) => {  
      }, err => {
        let toast = this.toastCtrl.create({
          message: "Error sending or recieving messages",
          duration: 3000,
          position: 'bottom'
        });
        toast.present();
      })

      this.form.reset(
        {
          content: '',
          conversation: this.conversationId,
          user: this._authentication.currentUser()._id, createdAt: Date.now()
        }
      );
    this.subscription.add(sendMessage);
  }
}
