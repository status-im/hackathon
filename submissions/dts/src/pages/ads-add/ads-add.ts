import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AdsPage } from '../ads/ads';

@Component({
    selector    : 'page-ads-add',
    templateUrl : 'ads-add.html'
})
export class AdsAddPage {
    public account;
    private newAdsForm : FormGroup;
    
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService) {
        
        var self = this;
        
        this.initialize();
    }
    
    ionViewWillEnter() { 
        this.initialize();
    }
    
    private initialize() {
        var self = this;
        this.newAdsForm = this.formBuilder.group({
            title       : ['', Validators.compose([Validators.maxLength(30), Validators.required])],
            description : ['', Validators.compose([Validators.maxLength(100), Validators.required])],
            discipline  : ['', Validators.required]
        });
    }
    
    submitAds() {
        var self = this;

        let successNotif = this.alertCtrl.create({
          title: 'Ads submitted',
          subTitle: 'Your ad has been submitted.',
          buttons: [{
              text: 'OK',
              handler: data => {
                this.newAdsForm.reset();
                this.navCtrl.setRoot(AdsPage);
              }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        this.contractService.publishAds(this.newAdsForm.value.title, this.newAdsForm.value.description, this.newAdsForm.value.discipline).then(function(res) {
            self.logger.debug(res);
            loader.dismiss();
            successNotif.present();
        });
        
        
    }

}
