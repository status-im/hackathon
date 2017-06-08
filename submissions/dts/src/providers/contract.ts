import { Injectable } from '@angular/core';
import { Logger } from "angular2-logger/core";
import Web3 from 'web3'
import { EthereumService } from './ethereum';
import { UtilsService } from './utils';
import * as contract from 'truffle-contract';
import {Http} from '@angular/http';
import { environment }    from '../../environment';

declare var web3: any;

@Injectable()
export class ContractService {
    
    private account;
    private provider;
    private web3 : Web3;
    private provider;
    private adsRegistryContract;
    private teacherRegistryContract;
    private courseRegistryContract;
    private courseContract;
    
    
    constructor(private logger: Logger, private ethereumService: EthereumService, private http: Http, private utils: UtilsService) {
        var self = this;
        
        if (typeof web3 !== 'undefined') {
            this.provider = web3.currentProvider;
        } else {
            this.provider = new Web3.providers.HttpProvider(environment.rpcurl);
        }
        this.web3 = new Web3(this.provider);

        self.logger.debug("contracts/AdsRegistry.json");
        this.http.get("contracts/AdsRegistry.json").subscribe(data => {
            self.adsRegistryContract = contract(data.json())
            self.adsRegistryContract.setProvider(self.provider)
        });
        
        self.logger.debug("contracts/TeacherRegistry.json");
        this.http.get("contracts/TeacherRegistry.json").subscribe(data => {
            self.teacherRegistryContract = contract(data.json())
            self.teacherRegistryContract.setProvider(self.provider)
        });
        
        self.logger.debug("contracts/CourseRegistry.json");
        this.http.get("contracts/CourseRegistry.json").subscribe(data => {
            self.courseRegistryContract = contract(data.json())
            self.courseRegistryContract.setProvider(self.provider)
        });
        
        self.logger.debug("contracts/Course.json");
        this.http.get("contracts/Course.json").subscribe(data => {
            self.courseContract = contract(data.json())
            self.courseContract.setProvider(self.provider)
        });
        
        
        ethereumService.getAddresses().then(function(accounts) {
            self.logger.debug(accounts);
            self.account = accounts[0];
            self.web3.eth.defaultAccount = accounts[0];
        });
        
    }
 
    /* *************************
     * ADS REGISTRY
     * *************************/
 
    public getAds() {
        var self = this;
        
        self.logger.debug("getAds(): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/AdsRegistry.json").subscribe(data => {
                self.adsRegistryContract.deployed().then(function(instance) {
                    return instance.getAds.call({from: self.account})
                    
                }).then(function(result) {
                    
                    var ads = [];
                    for(var i = 0; i < result[0].length; i++) {
                        var ad = {
                            id              : Number(result[0][i]),
                            teacherAddress  : result[1][i],
                            title           : self.web3.toAscii(result[2][i]),
                            description     : self.web3.toAscii(result[3][i]),
                            discipline      : self.web3.toAscii(result[4][i]),
                            dateCreated     : new Date(Number(result[5]) * 1000)
                        };
                        ads.push(ad);
                    }
                    
                    resolve(ads);
                    
                }, function(error) {
                    self.logger.error("getAds(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public publishAds (title, description, discipline) {
        var self = this;
        
        self.logger.debug("publishAds(title="+title+", description="+description+", discipline="+discipline+", from="+ self.account+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/AdsRegistry.json").subscribe(data => {
                self.adsRegistryContract.deployed().then(function(instance) {
                    return instance.publishAds(self.account, title, description, discipline, {from: self.account, gas: 4000000})
                    
                }).then(function(result) {
                    self.logger.debug("publishAds(title="+title+", description="+description+", discipline="+discipline+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("publishAds(title="+title+", description="+description+", discipline="+discipline+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    };
    
    /* *************************
     * TEACHER REGISTRY 
     * *************************/
    public getTeacherInfo() {
        var self = this;
        
        self.logger.debug("getTeacherInfo(): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/TeacherRegistry.json").subscribe(data => {
                self.teacherRegistryContract.deployed().then(function(instance) {
                    return instance.getTeacherInfo.call(self.account, {from: self.account})
                    
                }).then(function(result) {
                    self.logger.debug("getTeacherInfo(): "+result);
                    self.logger.debug(result);
                    
                    var teacherInfo = {
                        name    : self.web3.toAscii(result[0]),
                        address : result[1],
                        enable  : result[1] != "0x0000000000000000000000000000000000000000"
                    }
                    
                    resolve(teacherInfo);
                    
                }, function(error) {
                    self.logger.error("getTeacherInfo(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public isTeacher() {
        var self = this;
        
        self.logger.debug("isTeacher(): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/TeacherRegistry.json").subscribe(data => {
                self.teacherRegistryContract.deployed().then(function(instance) {
                    return instance.isTeacher.call({from: self.account})
                    
                }).then(function(result) {
                    self.logger.debug("isTeacher(): "+result);
                    
                    resolve(result);
                    
                }, function(error) {
                    self.logger.error("getAds(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public registerTeacher (name, disable) {
        var self = this;
        
        self.logger.debug("registerTeacher(name="+name+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/TeacherRegistry.json").subscribe(data => {
                self.teacherRegistryContract.deployed().then(function(instance) {
                    return instance.registerTeacher(self.account, name, disable, {from: self.account, gas: 4000000})
                    
                }).then(function(result) {
                    self.logger.debug("registerTeacher(name="+name+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("registerTeacher(name="+name+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    }
    

    /* *************************
     * COURSE REGISTRY
     * *************************/
    public getMyCourses() {
        var self = this;
        
        self.logger.debug("getMyCourses(): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/CourseRegistry.json").subscribe(data => {
                self.courseRegistryContract.deployed().then(function(instance) {
                    return instance.getMyCourses.call({from: self.account})
                    
                }).then(function(result) {
                    self.logger.debug("getMyCourses(): result=");
                    self.logger.debug(result);
                    
                    var promises = [];
                    var courses = [];
                    for(var i = 0; i < result[0].length; i++) {
                        if(result[0][i] !== "0x0000000000000000000000000000000000000000") {
                            var course = {
                                teacherAddress  : result[0][i],
                                studentAddress  : result[1][i],
                                courseAddress   : result[2][i]
                            };
                            courses.push(course);
                            promises.push(self.getCourseDetails(course.courseAddress));
                        }
                    }
                    
                    Promise.all(promises).then(function(result) {
                        for(var i = 0; i < courses.length; i++) {
                            courses[i].startDate    = result[i].startDate
                            courses[i].endDate      = result[i].endDate
                            courses[i].amount       = result[i].amount
                            courses[i].state        = result[i].state
                            courses[i].description  = result[i].description
                            courses[i].level        = result[i].level
                        }
                        
                        resolve(courses);
                    });
                    
                    
                }, function(error) {
                    self.logger.error("getMyCourses(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public getMyHistory() {
        var self = this;
        
        self.logger.debug("getMyHistory(): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/CourseRegistry.json").subscribe(data => {
                self.courseRegistryContract.deployed().then(function(instance) {
                    return instance.getMyHistory.call({from: self.account})
                    
                }).then(function(result) {
                    self.logger.debug("getMyHistory(): result=");
                    self.logger.debug(result);
                    
                    var promises = [];
                    var courses = [];
                    for(var i = 0; i < result[0].length; i++) {
                        if(result[0][i] !== "0x0000000000000000000000000000000000000000") {
                            var course = {
                                teacherAddress  : result[0][i],
                                studentAddress  : result[1][i],
                                courseAddress   : result[2][i]
                            };
                            courses.push(course);
                            promises.push(self.getCourseDetails(course.courseAddress));
                        }

                    }
                    
                    Promise.all(promises).then(function(result) {
                        for(var i = 0; i < courses.length; i++) {
                            courses[i].startDate    = result[i].startDate
                            courses[i].endDate      = result[i].endDate
                            courses[i].amount       = result[i].amount
                            courses[i].state        = result[i].state
                        }
                        
                        resolve(courses);
                    });
                    
                    
                }, function(error) {
                    self.logger.error("getMyCourses(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public registerCourse (studentAddress, startDate, endDate, amount, description, level) {
        var self = this;
        
        self.logger.debug("registerCourse(studentAddress="+studentAddress+", startDate="+startDate+", endDate="+endDate+", amount="+amount+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/CourseRegistry.json").subscribe(data => {
                self.courseRegistryContract.deployed().then(function(instance) {
                    return instance.registerCourse(studentAddress, startDate / 1000, endDate / 1000, self.web3.toWei(amount, "ether"), description, level, {from: self.account, gas: 4000000})
                    
                }).then(function(result) {
                    self.logger.debug("registerCourse(studentAddress="+studentAddress+", startDate="+startDate+", endDate="+endDate+", amount="+amount+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("registerCourse(studentAddress="+studentAddress+", startDate="+startDate+", endDate="+endDate+", amount="+amount+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    };    
    
    
    /* *************************
     * COURSE 
     * *************************/
    public getCourseDetails(courseAddress) {
        var self = this;
        
        self.logger.debug("getCourseDetails(courseAddress="+courseAddress+"): START");
       
        return new Promise(function(resolve, reject)     {
            
            self.http.get("contracts/Course.json").subscribe(data => {
                self.courseContract.at(courseAddress).then(function(instance) {
                    return instance.getCourseDetails.call({from: self.account})
                    
                }).then(function(result) {
                    self.logger.debug("getCourseDetails(courseAddress="+courseAddress+"): result=");
                    self.logger.debug(result);
                    
                    var course = {
                        studentAddress  : result[0],
                        teacherAddress  : result[1],
                        startDate       : new Date(Number(result[2]) * 1000),
                        endDate         : new Date(Number(result[3]) * 1000),
                        amount          : self.web3.fromWei(Number(result[4]), "ether"),
                        state           : self.utils.formatState(Number(result[5])),
                        level           : self.utils.formatLevel(Number(result[6])),
                        description     : self.web3.toAscii(result[7])
                    };
                    
                    resolve(course);
                    
                }, function(error) {
                    self.logger.error("getCourseDetails(): error="+error);
                    reject(error);
                }); 
            });
        });
    }
    
    public makePayment (courseAddress, amount) {
        var self = this;
        
        self.logger.debug("makePayment(courseAddress="+courseAddress+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/Course.json").subscribe(data => {
                self.courseContract.at(courseAddress).then(function(instance) {
                    return instance.makePayment({from: self.account, gas: 4000000, value: self.web3.toWei(amount, "ether")})
                    
                }).then(function(result) {
                    self.logger.debug("makePayment(courseAddress="+courseAddress+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("makePayment(courseAddress="+courseAddress+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    }; 
    
    public release (courseAddress) {
        var self = this;
        
        self.logger.debug("release(courseAddress="+courseAddress+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/Course.json").subscribe(data => {
                self.courseContract.at(courseAddress).then(function(instance) {
                    return instance.release({from: self.account, gas: 4000000 })
                    
                }).then(function(result) {
                    self.logger.debug("release(courseAddress="+courseAddress+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("release(courseAddress="+courseAddress+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    }; 
    
    public refund (courseAddress) {
        var self = this;
        
        self.logger.debug("refund(courseAddress="+courseAddress+"): START");

        return new Promise(function(resolve, reject) {
            
            self.http.get("contracts/Course.json").subscribe(data => {
                self.courseContract.at(courseAddress).then(function(instance) {
                    return instance.refund({from: self.account, gas: 4000000 })
                    
                }).then(function(result) {
                    self.logger.debug("refund(courseAddress="+courseAddress+"): transaction="+result);
                    self.logger.debug(result);
                    
                    resolve(result);
                }, function(error) {
                    self.logger.error("refund(courseAddress="+courseAddress+"): error="+error);
                    reject(error);                
                }); 
            });
        });
    }; 
     
     
}