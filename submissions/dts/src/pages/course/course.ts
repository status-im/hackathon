import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { UtilsService } from '../../providers/utils';
import { CourseAddPage } from '../course-add/course-add';
import { CourseViewPage } from '../course-view/course-view';
import { CourseHistoryPage } from '../course-history/course-history';

@Component({
    selector    : 'page-course',
    templateUrl : 'course.html'
})
export class CoursePage {
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

        this.contractService.getMyCourses().then(function(res) {
            self.logger.debug(res);
            self.coursesList = res;
        });
    }
    
    public addCourse() {
        var self = this;
        this.navCtrl.push(CourseAddPage);
    }
    
    public selectCourse(course) {
        var self = this;
        this.navCtrl.push(CourseViewPage, course);
    }
    
    public seeHistory() {
        var self = this;
        this.navCtrl.push(CourseHistoryPage);
    }

}
