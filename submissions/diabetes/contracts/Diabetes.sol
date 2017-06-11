pragma solidity ^0.4.4;

contract Diabetes {
	mapping (address => Person) public persons;

    struct Person {
        address personAddress;
        bool initialized;        
        uint numBloodGlucoseLevels;
        uint numReminders;
        mapping(uint => BloodGlucoseLevelLog) bloodGlucoseLevels;
        mapping(uint => Reminder) reminders;
    }

    struct BloodGlucoseLevelLog {
        address person;
        uint timestamp;
        uint concentration;
        string measured;
    }

    struct Reminder {
        address person;
        uint timestamp;
        string note;
        bool recurring;
    }
   
	event LogBloodGlucoseReadingAdded(address person, uint timestamp, uint concentration, string measured);
	event LogReminderAdded(address person, uint timestamp, string note, bool recurring);

	function Diabetes() {
	}

    function doesPersonExist() {
        var person = persons[msg.sender];
        if(!person.initialized) {
            var newPerson = Person(msg.sender, true, 0, 0);
            persons[msg.sender] = newPerson;
        }
    }

    function addBloodGlucoseReading(uint timestamp, uint concentration, string measured) {
        doesPersonExist();
        var newBloodGlucoseLevelLog = BloodGlucoseLevelLog(msg.sender, timestamp, concentration, measured);
        var person =  persons[msg.sender];
        var glucoseLevelId = person.numBloodGlucoseLevels++;
        person.bloodGlucoseLevels[glucoseLevelId] = newBloodGlucoseLevelLog;
        LogBloodGlucoseReadingAdded(msg.sender, timestamp, concentration, measured);
    }

	function addReminder(uint timestamp, string note, bool recurring) {
        doesPersonExist();
        var newReminder = Reminder(msg.sender, timestamp, note, recurring);
        var person = persons[msg.sender];
        var reminderId = person.numReminders++;
        person.reminders[reminderId] = newReminder;
        LogReminderAdded(msg.sender, timestamp, note, recurring);
    }

    function getPerson(address personAddress) constant returns (address addressPerson, bool initialized, uint numBloodGlucoseLevels, uint numReminders) {
        var person = persons[personAddress];
        return (person.personAddress, person.initialized, person.numBloodGlucoseLevels, person.numReminders);
    }

    function getBloodGlucoseReading(address personAddress, uint glucoseIndex) constant returns (address addressPerson, uint timestamp, uint concentration, string measured) {
        var bloodGlucoseReading = persons[personAddress].bloodGlucoseLevels[glucoseIndex];
        return (bloodGlucoseReading.person, bloodGlucoseReading.timestamp, bloodGlucoseReading.concentration, bloodGlucoseReading.measured);
    }

    function getReminder(address personAddress, uint reminderIndex) constant returns (address addressPerson, uint timestamp, string note, bool recurring) {
        var reminder = persons[personAddress].reminders[reminderIndex];
        return (reminder.person, reminder.timestamp, reminder.note, reminder.recurring);
    }
}
