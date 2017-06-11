import { Component }                            from '@angular/core';
import { NavController, AlertController }       from 'ionic-angular';
import { LoadingController }                    from 'ionic-angular';
import { Logger } from "angular2-logger/core";
import { EthereumService } from '../../providers/ethereum';
import { ContractService } from '../../providers/contract';
import { UtilsService } from '../../providers/utils';
import { Validators, FormBuilder, FormGroup }   from '@angular/forms';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
    private settingsForm : FormGroup;
    

    constructor(private nav: NavController, private alertCtrl: AlertController, private formBuilder: FormBuilder, public loadingCtrl: LoadingController, private logger: Logger, private ethereumService: EthereumService, private contractService: ContractService, private utils: UtilsService) {
        this.initialize();
    }
    
    ionViewWillEnter() { 
        this.initialize();
    }

    initialize(){
        var self = this;
        
        this.settingsForm = this.formBuilder.group({
            name       : ['', Validators.compose([Validators.maxLength(50), Validators.required])],
            enable     : []
        });
        
        this.contractService.getTeacherInfo().then(function(res) {
            self.logger.debug(res);
        
            self.settingsForm = self.formBuilder.group({
                name       : [self.utils.trim(res['name']), Validators.compose([Validators.maxLength(50), Validators.required])],
                enable     : [res['enable']]
            });
        });
    }
    
    update() {
        var self = this;
        
        this.contractService.registerTeacher(this.settingsForm.value.name, !this.settingsForm.value.enable).then(function(res) {
            self.logger.debug(res);
        });
    
    
    }

 
}