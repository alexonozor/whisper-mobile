import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { AuthenticationProvider } from '../../providers/authentication/authentication';
import { ContraceptiveProvider } from '../../providers/contraceptive/contraceptive';
import { Http } from '@angular/http';
import { PharmacyProvider } from '../../providers/pharmacy/pharmacy';
import { AssesmentProvider } from '../../providers/assesment/assesment';
import { Geolocation } from '@ionic-native/geolocation';
import { FoundPharmaciesPage } from '../assesment/assesment';

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
    public user = {};
    public contraceptiveId: number;
    public assesmentId: number;  
    public contraceptive = {};

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
      public http: Http
  ) {
      this.user = this.navParams.get('user');
      this.contraceptiveId = this.navParams.get('contraceptive');
      this.assesmentId = this.navParams.get('assesmentId');
  }

  ionViewDidLoad() {
    this.getContraceptive(this.contraceptiveId)
  }

  getContraceptive(id) {
    this._contraceptiveService.getContraceptive(id)
    .subscribe((resp) => {
      if (resp.success) {
        this.contraceptive = resp.contraceptive;
      }
    }, err => {
      // caught errors
    })
  }

  updateAssesmentResponseWithQuantity() {
    this.confirmUsersLocation(this.user)
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