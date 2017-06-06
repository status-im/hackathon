import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from "angular2-logger/core";

@Component({
    selector    : 'page-ads-view',
    templateUrl : 'ads-view.html'
})
export class AdsViewPage {
    public ads;
    
    constructor(public navCtrl: NavController, private navParams: NavParams, private logger: Logger) {
        this.ads = this.navParams.data;
    }
}
