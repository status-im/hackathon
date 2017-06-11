import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { UtilsService } from '../../providers/utils';
import { AdsAddPage } from '../ads-add/ads-add';
import { AdsViewPage } from '../ads-view/ads-view';

@Component({
    selector    : 'page-ads',
    templateUrl : 'ads.html'
})
export class AdsPage {
    public account;
    public adsList;
    public isTeacher;
    
    constructor(public navCtrl: NavController, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService, private utils: UtilsService) {
        
        var self = this;
        
        ethereumService.getAddresses().then(function(accounts) {
            self.logger.debug(accounts);
            self.account = accounts[0];
        });
        
        this.initialize();
    }
    
    ionViewWillEnter() { 
        this.initialize();
    }
    
    private initialize() {
        var self = this;
        
        this.isTeacher = this.utils.userType == "TEACHER";

        this.contractService.getAds().then(function(res) {
            self.logger.debug(res);
            self.adsList = res;
        });
    }
    
    public addAds() {
        var self = this;
        this.navCtrl.push(AdsAddPage);
    }
    
    public selectAds(ads) {
        var self = this;
        this.navCtrl.push(AdsViewPage, ads);
        
    }

}
