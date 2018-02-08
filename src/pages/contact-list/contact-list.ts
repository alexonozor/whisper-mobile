import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ModalController, ToastController, LoadingController, ViewController } from 'ionic-angular';
import { SharedProvider } from '../../providers/shared/shared';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { UserProvider } from '../../providers/user/user';
import { NotificationProvider } from '../../providers/notification/notification';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms'

/**
 * Generated class for the ContactListPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contact-list',
  templateUrl: 'contact-list.html',
})
export class ContactListPage {
  currentUser: any;
  threads: Array<any>;
  loading : any;

  constructor(
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public toastCtrl: ToastController, 
    public _auth: AuthenticationProvider,
    public _shared: SharedProvider,
    public modalCtrl: ModalController
  ) {
    this.currentUser = this._auth.currentUser()
  }

  loader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loading.present();
  }

  dismissLoader() { 
    this.loading.dismiss();
  } 

  ionViewDidLoad() {
    this.getUserRecentThreads(this.currentUser._id)
  }

  getUserRecentThreads(id) {
    this.loader()
    this._shared.getUserThreads(id)
    .subscribe((res) => {
      if (res.success) {
        this.dismissLoader();
        this.threads = res.thread;
      }
    }, err => {
      this.dismissLoader();
      alert(`Error fetching your treads.`);
    })
  }

  openThread(thread) {
    this.navCtrl.push(ContactConversationPage, { thread: thread });
  }

  openThreadForm() {
   let modal = this.modalCtrl.create(ContactFormPage,  { thread: this.threads })
    modal.onDidDismiss(data => {
      if (data) {
        this.getUserRecentThreads(this.currentUser._id)
      }
    });
    modal.present();
  }

}




@Component({
  selector: 'page-contact-conversation',
  templateUrl: './contact-conversation/contact-conversation.html',
})
export class ContactConversationPage {
  currentUser: any;
  thread: any;
  loading : any;
  userId: string;
  isSender: boolean = false;
  messages: Array<any> = [];
  messageForm: FormGroup;
  

  constructor(
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public _auth: AuthenticationProvider,
    public _shared: SharedProvider,
    public navCtrl: NavController,
    private fb: FormBuilder,
    public _notification: NotificationProvider
  ) {
    this.currentUser = this._auth.currentUser()
    this.thread = this.navParams.get('thread')
    this.createForm();
  }

  loader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loading.present();
  }

  dismissLoader() { 
    this.loading.dismiss();
  } 

  ionViewDidLoad() {
    this.checkSender(this.thread.messages)
  }

  checkSender(messageResponse) {
    this.userId = this.currentUser._id;
    messageResponse.forEach((el, i) => {
      el['isSender'] = ( el.user === this.userId );
      if (el['isSender']) {
        this.isSender = true;
      }
    });
    this.messages = messageResponse;
  }

  createForm() {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      thread: [this.thread._id],
      user: [this.currentUser._id],
      createdAt: [Date.now()]
    });
  }

  submitMessage() {
    this._shared.createThreadMessage(this.messageForm.value)
    .subscribe((res) => {
      if (res.success) {
        
      }
    }, err => {
      // error handling.
    })
     this.showMessage(this.messageForm.value)
  }

  
  showMessage(message) {
    message['user'] = { _id: this.userId, firstName: this.currentUser.firstName, lastName: this.currentUser.lastName }
    message['isSender'] = ( message.user._id === this.userId );
    this.messages.push(message);
    this.notifiyRecipient(this.thread._id) 
    this.createForm()
  }

  notifiyRecipient(threadId) {
    this._notification.create({
      sender: this.currentUser._id, 
      receiver: this.thread.reciepaint._id, 
      notification_type_id: threadId,
      notification_type: 'message',
      content: `you have a new message from ${this.currentUser.firstName}`
    }).subscribe((resp) => {
        if (resp.success) {
        
        }
    }, err => {
   
    })
  }


}


@Component({
  selector: 'page-contact-form',
  templateUrl: './contact-form/contact-form.html',
})
export class ContactFormPage {
  currentUser: any;
  thread: any;
  loading : any;
  messageForm: FormGroup;
  

  constructor(
    public loadingCtrl: LoadingController,
    public navParams: NavParams,
    public toastCtrl: ToastController, 
    public _auth: AuthenticationProvider,
    public _shared: SharedProvider,
    private fb: FormBuilder,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public _notification: NotificationProvider,
    public _userService: UserProvider
  ) {
    this.currentUser = this._auth.currentUser();
    this.thread = this.navParams.get('thread')
    this.createForm();
  }

  loader() {
    this.loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: '<img src="assets/img/loader.svg" />',
    });
    this.loading.present();
  }

  dismissLoader() { 
    this.loading.dismiss();
  } 

  ionViewDidLoad() {
   
  }

 

  createForm() {
    this.messageForm = this.fb.group({
      content: ['', Validators.required],
      thread: [],
      user: [this.currentUser._id],
      subject: ['', Validators.required],
      createdAt: [Date.now()]
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }

  

  submitMessage() {
    this.loader()
    this.createThread()
  }

  createThread() {
    this._shared.createMessageThread(
      this._userService.allAdmin()[0]._id, this.currentUser._id, this.messageForm.value.subject)
      .subscribe((res) => {
        if (res.success) {
          this.messageForm.patchValue({ thread:  res.thread._id})
          this.createMessage(res.thread._id)
        }
      }, err => {
        this.dismissLoader();
        alert('Internet error, unable to create thread.')
      })
  }

  createMessage(threadId) {
    this._shared.createThreadMessage(this.messageForm.value)
    .subscribe((res) => {
      if (res.sucess) {
        this.notifiyRecipient(threadId);   
      }
    }, err => {
      // error handling.
      this.dismissLoader();
      alert('internal server error, please check your network')
    })
  }

  notifiyRecipient(threadId) {

    console.log(this._userService.allAdmin())
    this._notification.create({
      sender: this.currentUser._id, 
      receiver: this._userService.allAdmin()[0]._id, 
      notification_type_id: threadId,
      notification_type: 'message',
      content: `New contact message from ${this.currentUser.firstName}`
    }).subscribe((resp) => {
      this.dismissLoader(); 
      this.presentToast('Message sent!! you will be contacted shortly');
      let pullData = true;
      this.viewCtrl.dismiss(pullData);
    }, err => {
      alert('Internal server error. notification not sent to admin!')
    })
  }

  closeModal() {
    let pullData = false;
    this.viewCtrl.dismiss();
  }

}

