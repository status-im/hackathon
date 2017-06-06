import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { UtilsService } from '../../providers/utils';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

@Component({
    selector    : 'page-course-view',
    templateUrl : 'course-view.html'
})
export class CourseViewPage {
    public course;
    public isTeacher;
    
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private navParams: NavParams, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService, private utils: UtilsService) {
        var self = this;
        
        this.isTeacher = this.utils.userType == "TEACHER";
        
        this.course = this.navParams.data;
    }
    
    public release() {
        var self = this;

        let successNotif = this.alertCtrl.create({
          title: 'Release',
          subTitle: 'The payment has been released to your account.',
          buttons: [{
              text: 'OK',
              handler: data => { }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        this.contractService.release(this.course.courseAddress).then(function(res) {
            self.logger.debug(res);
            loader.dismiss();
            successNotif.present();
        });
    }
    
    public refund() {
        var self = this;

        let successNotif = this.alertCtrl.create({
          title: 'Refund',
          subTitle: 'The payment has been refunded to the student account.',
          buttons: [{
              text: 'OK',
              handler: data => { }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        this.contractService.refund(this.course.courseAddress).then(function(res) {
            self.logger.debug(res);
            loader.dismiss();
            successNotif.present();
        });
    }
    
    public makePayment() {
        var self = this;

        let successNotif = this.alertCtrl.create({
          title: 'Payment',
          subTitle: 'Your payment has been submitted.',
          buttons: [{
              text: 'OK',
              handler: data => { }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        
        this.contractService.makePayment(this.course.courseAddress, this.course.amount).then(function(res) {
            self.logger.debug(res);
            loader.dismiss();
            successNotif.present();
        });
        
    }
}
