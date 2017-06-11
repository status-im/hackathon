import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { ToastController } from 'ionic-angular';
import * as Clipboard from 'clipboard/dist/clipboard.min.js';

@Component({
    selector    : 'page-ads-view',
    templateUrl : 'ads-view.html'
})
export class AdsViewPage {
    public ads;
    public clipboard;
    
    constructor(public navCtrl: NavController, private navParams: NavParams, private logger: Logger, public toastCtrl: ToastController) {
        this.ads = this.navParams.data;
        this.ads.teacherAddressTrunc = this.ads.teacherAddress.substring(0, 20) + "...";
        
        this.clipboard = new Clipboard('#cpyBtn');
        this.clipboard.on('success', () => this.showMsg(toastCtrl));
    }
        
    showMsg(toastCtrl: ToastController) {
        let toast = toastCtrl.create({
            message: 'Its copied to clipboard',
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    
    public startChat() {
        let toast = this.toastCtrl.create({
            message: 'Feature not available',
            duration: 3000,
            position: 'top'
        });
        toast.present();
    }
    
    
}
