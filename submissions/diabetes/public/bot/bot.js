var DiabetesABI = [{"constant":true,"inputs":[{"name":"personAddress","type":"address"},{"name":"reminderIndex","type":"uint256"}],"name":"getReminder","outputs":[{"name":"addressPerson","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"note","type":"string"},{"name":"recurring","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"personAddress","type":"address"}],"name":"getPerson","outputs":[{"name":"addressPerson","type":"address"},{"name":"initialized","type":"bool"},{"name":"numBloodGlucoseLevels","type":"uint256"},{"name":"numReminders","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"persons","outputs":[{"name":"personAddress","type":"address"},{"name":"initialized","type":"bool"},{"name":"numBloodGlucoseLevels","type":"uint256"},{"name":"numReminders","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"doesPersonExist","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"timestamp","type":"uint256"},{"name":"note","type":"string"},{"name":"recurring","type":"bool"}],"name":"addReminder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"timestamp","type":"uint256"},{"name":"concentration","type":"uint256"},{"name":"measured","type":"string"}],"name":"addBloodGlucoseReading","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"personAddress","type":"address"},{"name":"glucoseIndex","type":"uint256"}],"name":"getBloodGlucoseReading","outputs":[{"name":"addressPerson","type":"address"},{"name":"timestamp","type":"uint256"},{"name":"concentration","type":"uint256"},{"name":"measured","type":"string"}],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"person","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"concentration","type":"uint256"},{"indexed":false,"name":"measured","type":"string"}],"name":"LogBloodGlucoseReadingAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"person","type":"address"},{"indexed":false,"name":"timestamp","type":"uint256"},{"indexed":false,"name":"note","type":"string"},{"indexed":false,"name":"recurring","type":"bool"}],"name":"LogReminderAdded","type":"event"}];
var DiabetesAddress = "0x2c740690d2ccd530eb4f4a5cd3340ec918efdbe6";
var DiabetesContract = web3.eth.contract(DiabetesABI);
var Diabetes = DiabetesContract.at(DiabetesAddress);

var StepEnum = {
  START: 0,
  GLUCOSE_LEVEL: 1,
  GLUCOSE_DATE: 2,
  GLUCOSE_TIME: 3,
  GLUCOSE_MEASURED: 4,
  GLUCOSE_NOTE: 5,
  GLUCOSE_CONFIRM: 6
}

status.addListener("on-message-send", function (params, context) {
    var result = {
            err: null,
            data: null,
            messages: []
        };

    try {
      result["text-message"] = "Hi, I'm Pippo, your personal diabetes bot! How can I help you today?";
    } catch (e) {
        result.err = e;
    }
    return result;
});

status.command({
    name: "add-glucose-lv",
    title: "add-glucose-lv",
    description: "Add a new blood glucose level reading",
    sequentialParams: true,
    params: [  
    {
        name: "level",
        type: status.types.NUMBER,
        placeholder: "Glucose level in mg/dL"
    }, {
        name: "date",
        type: status.types.TEXT,
        placeholder: "date in DD/MM/YY format"
    }, {
        name: "time",
        type: status.types.TEXT,
        placeholder: "time in MM:HH format"
    }, {
        name: "measured",
        type: status.types.TEXT,
        placeholder: "After lunch / Fasting glucose / Recheck"
    },
    ],
    handler: function(params) {
      var dateTime = Date.parse(params.date + ' ' + params.time)
      Diabetes.addBloodGlucoseReading(dateTime, params.level, params.measured, {from: web3.eth.accounts[0]});
      localStorage.setItem('currentStep', StepEnum.GLUCOSE_LEVEL)
      localStorage.setItem('glucoseLevel', params.level);
      localStorage.setItem('glucoseDate', params.date);
      localStorage.setItem('glucoseTime', params.time);
      localStorage.setItem('glucoseMeasured', params.measured);
      return {"text-message": "Blood glucose reading has been added!"}
      //console.log('PARAMS', params)
    }
});

status.command({
    name: "show-glucose-log",
    title: "show-glucose-log",
    description: "View your blood glucose readings",
    handler: function(params) {
      var person = Diabetes.getPerson.call(web3.eth.accounts[0], {from: web3.eth.accounts[0]});
      if(person[2] == 0) {
        return {"text-message": "You have no readings yet!"}
      } else {
        status.sendMessage("Here are you readings");
        for(var i = 0; i < person[2]; i++) {
          var glucoseReading = Diabetes.getBloodGlucoseReading.call(web3.eth.accounts[0], i, {from: web3.eth.accounts[0]});
          status.sendMessage("Measured: " + glucoseReading[3] + ". Concentration: " + glucoseReading[2] + "mg/dL.");
        }
      }
      
    }
});

status.command({
    name: "add-reminder",
    title: "add-reminder",
    description: "Add a new reminder",
    sequentialParams: true,
    params: [  
    {
        name: "what",
        type: status.types.TEXT,
        placeholder: "reminder for?"
    }, {
        name: "start_date",
        type: status.types.TEXT,
        placeholder: "date in DD/MM/YY format"
    }, {
        name: "start_time",
        type: status.types.TEXT,
        placeholder: "time in MM:HH format"
    },
    ],
    handler: function(params) {
      //TODO fix this
      var dateTime = Date.parse(params.date + ' ' + params.time)
      Diabetes.addReminder(dateTime, params.what, false, {from: web3.eth.accounts[0]});

      localStorage.setItem('reminderWhat', params.what);
      localStorage.setItem('reminderStartDate', params.start_date);
      localStorage.setItem('reminderStartTime', params.start_time);
      return {"text-message": "Reminder has been added!"}
      //console.log('PARAMS', params)
    }
});

status.command({
    name: "show-reminders",
    title: "show-reminders",
    description: "View your reminders",
    handler: function(params) {
      var person = Diabetes.getPerson.call(web3.eth.accounts[0], {from: web3.eth.accounts[0]});
      if(person[3] == 0) {
        return {"text-message": "You have no reminders yet!"}
      } else {
        status.sendMessage("Here are you reminders");
        for(var i = 0; i < person[3]; i++) {
          var reminder = Diabetes.getReminder.call(web3.eth.accounts[0], i, {from: web3.eth.accounts[0]});
          status.sendMessage("Reminder: " + reminder[2]);
        }
      }
      
    }
});


