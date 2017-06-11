import { Injectable } from '@angular/core';
import { Logger } from "angular2-logger/core";

@Injectable()
export class UtilsService {
    
    public userType;
    
    constructor(private logger: Logger) {

        
    }
 
     public trim(a) {
          var c = a.indexOf('\0');
          if (c>-1) {
            return a.substr(0, c);
          }
          return a;
    }

    public formatState (stateCode) {
            switch (Number(stateCode)) {
                case 0:
                    return {
                        code    : Number(stateCode),
                        label   : "CREATED"
                    };
                case 1:
                    return {
                        code    : Number(stateCode),
                        label   : "PAID"
                    };
                case 2:
                    return {
                        code    : Number(stateCode),
                        label   : "REFUNDED"
                    };
                case 3:
                    return {
                        code    : Number(stateCode),
                        label   : "ENDED"
                    };
                case 4:
                    return {
                        code    : Number(stateCode),
                        label   : "CANCELLED"
                    };
                default:
                    return {
                        code    : 99,
                        label   : "UNKNOWN"
                    };
            }
    }

    public formatLevel (levelCode) {
            switch (Number(levelCode)) {
                case 0:
                    return {
                        code    : Number(levelCode),
                        label   : "BEGINNER"
                    };
                case 1:
                    return {
                        code    : Number(levelCode),
                        label   : "INTERMEDIATE"
                    };
                case 2:
                    return {
                        code    : Number(levelCode),
                        label   : "ADVANCED"
                    };
                default:
                    return {
                        code    : 99,
                        label   : "UNKNOWN"
                    };
            }
    }
 
}