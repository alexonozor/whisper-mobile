import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder } from '@angular/forms';
import { AssesmentProvider } from '../../../providers/assesment/assesment';
import { AuthenticationProvider } from '../../../providers/authentication/authentication';


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

  private form = this.formBuilder.group({
    content: ['', Validators.required],
    conversation: [this.conversationId],
    user: [this._authentication.currentUser()._id],
    createdAt: [Date.now()]
  });

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public formBuilder: FormBuilder,
    public _authentication: AuthenticationProvider,
    public _assesmentService: AssesmentProvider) 
    {
      this.conversationId = this.navParams.get('conversationId');
      this.form.patchValue({ conversation: this.conversationId });
      
     }

  ionViewDidLoad() {
    
    this._assesmentService.connectToroom(this.conversationId)
    this.getMessages();
    this._assesmentService.getAssementResponsesMessage(this.conversationId)
    .subscribe((resp) => {
      if (resp.success) {
        this.conversation = resp.conversation;
        this.checkSender(resp.conversation.messages);
        
      }
    })
  }


  getMessages() {
     this._assesmentService.getMessages().subscribe(message => {
      message['isSender'] = ( message.user == this.userId )
     this.messageResponse.push(message);
    })
  }

  checkSender(messageResponse) {
    this.userId = this._authentication.currentUser()._id;
    messageResponse.forEach((el, i) => {
      el['isSender'] = ( el.user == this.userId )
    })
    this.messageResponse = messageResponse;
  }

  sendMessage() {
    this._assesmentService.sendResponsesMessage(this.form.value).subscribe((res) => {
      console.log(res)
    }, err => {

    })

    this.form.reset(
      {
        content: '',
        conversation: this.conversationId,
        user: this._authentication.currentUser()._id, createdAt: Date.now()
      }
    );
  }



}
