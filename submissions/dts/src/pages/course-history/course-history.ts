import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { UtilsService } from '../../providers/utils';
import { CourseViewPage } from '../course-view/course-view';

@Component({
    selector    : 'page-course-history',
    templateUrl : 'course-history.html'
})
export class CourseHistoryPage {
    public account;
    public coursesList;
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

        this.contractService.getMyHistory().then(function(res) {
            self.logger.debug(res);
            self.coursesList = res;
        });
    }
    
    public selectCourse(course) {
        var self = this;
        this.navCtrl.push(CourseViewPage, course);
    }


}
