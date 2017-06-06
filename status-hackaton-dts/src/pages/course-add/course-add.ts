import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { CoursePage } from '../course/course';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector    : 'page-course-add',
    templateUrl : 'course-add.html'
})
export class CourseAddPage {

    private newCourseForm : FormGroup;
    
    constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, public formBuilder: FormBuilder, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService) {
        
        var self = this;
        
        this.initialize();
    }
    
    ionViewWillEnter() { 
        this.initialize();
    }
    
    private initialize() {
        var self = this;
        this.newCourseForm = this.formBuilder.group({
            studentAddress       : ['', Validators.compose([Validators.maxLength(42), Validators.required])],
            startDate            : ['', Validators.required],
            startTime            : ['', Validators.required],
            endDate              : ['', Validators.required],
            endTime              : ['', Validators.required],
            amount               : ['', Validators.required],
        });
    }
    
    submitCourse() {
        var self = this;

        let successNotif = this.alertCtrl.create({
          title: 'Course submitted',
          subTitle: 'Your new course has been submitted.',
          buttons: [{
              text: 'OK',
              handler: data => {
                this.newCourseForm.reset();
                this.navCtrl.setRoot(CoursePage);
              }
            }]
        });
        
        let loader = this.loadingCtrl.create({
            content: "Please wait..."
        });
        loader.present();
        self.logger.debug(this.newCourseForm.value.startDate);
        self.logger.debug(this.newCourseForm.value.startTime);
        self.logger.debug(this.newCourseForm.value.endDate);
        self.logger.debug(this.newCourseForm.value.endTime);
        

        let startDate = new Date(this.newCourseForm.value.startDate + "T" + this.newCourseForm.value.startTime);
        let endDate = new Date(this.newCourseForm.value.endDate + "T" + this.newCourseForm.value.endTime);

        this.contractService.registerCourse(this.newCourseForm.value.studentAddress, startDate.getTime(), endDate.getTime(), this.newCourseForm.value.amount).then(function(res) {
            self.logger.debug(res);
            loader.dismiss();
            successNotif.present();
        });
        
        
    }

}
