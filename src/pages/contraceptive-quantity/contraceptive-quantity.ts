import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { UserProvider } from '../../providers/user/user';
import { Http } from '@angular/http';
import { PharmacyProvider } from '../../providers/pharmacy/pharmacy';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { Geolocation } from '@ionic-native/geolocation';
import { FoundPharmaciesPage } from '../assesment/assesment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * Generated class for the ContraceptiveQuantityPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-contraceptive-quantity',
  templateUrl: 'contraceptive-quantity.html',
})

export class ContraceptiveQuantityPage {
    public user;
    public contraceptiveId: number;
    public assesmentId: string;
    public contraceptive;
    public quantityRange = [];
    public quantityForm: FormGroup
    public userOrders = [];
    public isFirstTimeOrder: boolean;

    constructor(
      private alertCtrl: AlertController,
      public navCtrl: NavController,
      public loadingCtrl: LoadingController,
      public navParams: NavParams,
      public toastCtrl: ToastController,
      public _contraceptiveService: ContraceptiveProvider,
      public _authService: AuthenticationProvider,
      private geolocation: Geolocation,
      public _assesmentService: AssesmentProvider,
      public _pharmacyService: PharmacyProvider,
      public _userService: UserProvider,
      public http: Http,
      public fb: FormBuilder
  ) {
      this.user = this.navParams.get('user');
      this.contraceptiveId = this.navParams.get('contraceptive');
      this.assesmentId = this.navParams.get('assesmentId');
      this.createForm();
  }

  ionViewDidLoad() {
    this.getUserOrders(this.user._id);
  }

  createForm() {
    this.quantityForm = this.fb.group({
      grandTotal: ['', Validators.required],
      shippingMethod: ['', Validators.required]
    })
  }


  getUserOrders(id) {
    this._userService.getUser(id)
    .subscribe((resp) => {
      if (resp.success) {
        this.userOrders =  resp.user.orders;
        this.getContraceptive(this.contraceptiveId);
      }
    }, err => {
      // caught error
    })
  }


  getContraceptive(id) {
    this._contraceptiveService.getContraceptive(id)
    .subscribe((resp) => {
      if (resp.success) {
        this.contraceptive = resp.contraceptive;
        this.quantityRange = this.range(resp.contraceptive.minimumShippingQuantity, resp.contraceptive.maxmumShippingQuantity);
        this.isFirstTimeOrder = this.firstTimeOrder(this.userOrders, this.contraceptiveId)
        resp.shippingMethods = ['Delivery', 'Pickup'];
        // mocking min & max shipping quantity
        resp.contraceptive.minimumShippingQuantity = 2;
        resp.contraceptive.maximumShippingQuantity = 50;
      }
    }, err => {
      // caught errors
      console.log('An error occured, can\'t find contraceptive');
    })
  };

  


  firstTimeOrder(orders: Array<any>, contraceptiveId: number ) :boolean {
    orders.forEach(element => {
      console.log(element == contraceptiveId);
      if (element == contraceptiveId) { 
        return false;
      }
    });
    return true
  }



  updateResponse() {
    this._assesmentService.updateResponse(this.assesmentId,  this.quantityForm.value, true )
    .subscribe((resp) => {
      if (resp.success) {
        this.updateAssesmentResponseWithQuantity();
      } else {
          // Unable to update response
        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      }
    }, (err) => {
      // Unable to update response
      let toast = this.toastCtrl.create({
        message: 'internal server error',
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }

  range(lowEnd, highEnd) {
    console.log('low end ', lowEnd);
    console.log('high end ', highEnd);
    let arr = [];

    while(lowEnd <= highEnd){
      arr.push(lowEnd++);
    }

    return arr;
  }


  updateAssesmentResponseWithQuantity() {
    this.confirmUsersLocation(this.user);
  }

  confirmUsersLocation(user) {
    let confirm = this.alertCtrl.create({
      title: 'Select Location to search Pharmacy',
      message: `Your current location is ${user.contact.address}. Whisper wants to find a pharmacy close to you for your contraceptive?`,
      buttons: [
        {
          text: 'Use location',
          handler: () => {
            // find pharmacy with users loaction
            this.findPharmacies(user.contact.lng, user.contact.lat);
          }
        },
        {
          text: 'Use GPS',
          handler: () => {
           // get users new location via gps
           this.getLocation();
          }
        }
      ]
    });
    confirm.present();
  }

  

  findPharmacies(longitude, latitude) {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: 'finding pharmacies...'
   });

    loading.present();
    this._pharmacyService.getNearerPharmacies(longitude, latitude)
    .subscribe((resp) => {
      if (resp.success) {
        // mock data
        resp.pharmacies = [
          {
            name: 'Health plus',
            description: "Lagos pharmacy",
            contact: {
              address:"lagos"
            }
          },
          {
            name: 'Alpha pharm',
            description: "Lagos pharmacy",
            contact: {
              address:"lagos"
            }
          },
          {
            name: 'Medplus',
            description: "Lagos pharmacy",
            contact: {
              address:"lagos"
            }
          }
        ];
        this.navCtrl.push(FoundPharmaciesPage, { pharmacies: resp.pharmacies, responseId: this.assesmentId })
        loading.dismiss();
      } 
    }, err => {
      // caugh error
    })
  }

  getLocation() {
    let loading = this.loadingCtrl.create({
      spinner: 'show',
      showBackdrop: false,
      content: 'finding location...'
   });

    loading.present();
    this.geolocation.getCurrentPosition().then((resp) => {
        var lat=resp.coords.latitude;
        var long=resp.coords.longitude;
        this.http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+long+'&sensor=true&key=AIzaSyDXKmoSEMQW6mAI_WVZqwDP3M9tMhsKTRk').map(res=>res.json()).subscribe(data => {
          loading.dismiss();    
          let addresses = data.results;
          this.showFoundAddresses(addresses);
        });
      }).catch((error) => {
        loading.dismiss();
        console.log('Error getting location', error);
      });
  }

 

  showFoundAddresses(addresses) {
      let alert = this.alertCtrl.create();
      alert.setTitle('Select Address');
      addresses.forEach(element => {
        alert.addInput({
          type: 'radio',
          label: element.formatted_address,
          value: element.geometry.location,
          checked: false
        });
      });

      alert.addButton('Cancel');
      alert.addButton({
        text: 'OK',
        handler: data => {
          this.findPharmacies(data.lng, data.lat)
        }
      });
      alert.present();
  }



}
