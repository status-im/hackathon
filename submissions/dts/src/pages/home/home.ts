import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

    public account;
    public balance;
    
    constructor(public navCtrl: NavController, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService) {

        this.initialize();
    }
    
    ionViewWillEnter() { 
        this.initialize();
    }
    
    private initialize() {
        var self = this;
        self.ethereumService.getAddresses().then(function(accounts) {
            self.logger.debug(accounts);
            self.account = accounts[0];
            
            self.ethereumService.getBalance(self.account).then(function(balance) {
                self.logger.debug(balance);
                self.balance = balance;
            });
            
        });
    }

    public logout() {
        this.navCtrl.parent.parent.setRoot(LoginPage);
    }

    
}
