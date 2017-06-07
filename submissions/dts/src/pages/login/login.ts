import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { UtilsService } from '../../providers/utils';
 
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

    constructor(private nav: NavController, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private utils: UtilsService) { 
    
    }
 

    public login(type) {
        console.log("type="+type)
        this.utils.userType = type;
        this.nav.setRoot(TabsPage);

    }


}