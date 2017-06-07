pragma solidity ^0.4.8;

import './Course.sol';
import './common/Common.sol';

//*********************************************************************
//* @title CourseRegistry
//* @dev 
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract CourseRegistry {

    //***********************
    //* Structure and enums     
    //*
    struct CourseStrct {
        address         teacherAddress;
        address         studentAddress;
        address         courseAddress;
        Common.State    state;
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant

    // Variables  
    mapping(address => CourseStrct)     courseRegistery;
    mapping(uint => address)            courseRegisteryID;
    uint public                         nbCourses;

    //***********************/
    
    
    //***********************
    //* Modifier    
    //*
    modifier onlyCourse (address _courseAddress) {
        if (msg.sender != _courseAddress) throw;
        _;
    }
    //***********************
    
    
    //***********************
    //* Events      
    //*

    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function CourseRegistry() {  }
    //***********************/

    
    //***********************
    //* Getter   
    //*
    function getMyCourses() constant returns  (address[] _teacherAddress, address[] _studentAddress, address[] _courseAddress, uint _length) {
    
        uint length = nbCourses;
    
        address[]   memory adsTeacherAddressArray  = new address[](nbCourses);
        address[]   memory adsStudentAddressArray  = new address[](nbCourses);
        address[]   memory adsCourseAddressArray  = new address[](nbCourses);

        uint index = 0;
        for (var i = 0; i < nbCourses ; i++) {
            CourseStrct memory course = courseRegistery[courseRegisteryID[i]];
        
            if((course.teacherAddress == msg.sender || course.studentAddress == msg.sender) && (course.state == Common.State.PAID || course.state == Common.State.CREATED)) {
                adsTeacherAddressArray[index]  = course.teacherAddress;
                adsStudentAddressArray[index]  = course.studentAddress;
                adsCourseAddressArray[index]   = course.courseAddress;
                index++;
            }
        }
        
        return (adsTeacherAddressArray, adsStudentAddressArray, adsCourseAddressArray, length); 
    }
    function getMyHistory() constant returns  (address[] _teacherAddress, address[] _studentAddress, address[] _courseAddress, uint _length) {
    
        uint length = nbCourses;
    
        address[]   memory adsTeacherAddressArray  = new address[](nbCourses);
        address[]   memory adsStudentAddressArray  = new address[](nbCourses);
        address[]   memory adsCourseAddressArray  = new address[](nbCourses);

        uint index = 0;
        for (var i = 0; i < nbCourses ; i++) {
            CourseStrct memory course = courseRegistery[courseRegisteryID[i]];
        
            if((course.teacherAddress == msg.sender || course.studentAddress == msg.sender) && (course.state == Common.State.ENDED || course.state == Common.State.REFUNDED|| course.state == Common.State.CANCELLED)) {
                adsTeacherAddressArray[index]  = course.teacherAddress;
                adsStudentAddressArray[index]  = course.studentAddress;
                adsCourseAddressArray[index]   = course.courseAddress;
                index++;
            }
        }
        
        return (adsTeacherAddressArray, adsStudentAddressArray, adsCourseAddressArray, length); 
    }
    //***********************/
    
    
    //***********************
    //* Public functions    
    //*
    function registerCourse(address _studentAddress, uint _startDateTime, uint _endDateTime, uint _amount, bytes32 _description, Common.Level _level) {
        
        // Build the contract
        address courseAddress = new Course(this, _studentAddress, msg.sender, _startDateTime, _endDateTime, _amount, _description, _level);
        
        // Register the Course
        CourseStrct memory course; 
        course.teacherAddress   = msg.sender;
        course.studentAddress   = _studentAddress;
        course.courseAddress    = courseAddress;
        course.state            = Common.State.CREATED;
        
        courseRegistery[courseAddress] = course;
        courseRegisteryID[nbCourses] = courseAddress;
        nbCourses++;
        
        //TODO event
    }
  
    function updateState(address _courseAddress, Common.State _state) onlyCourse(_courseAddress) {
        courseRegistery[_courseAddress].state = _state;
    }
  
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/
    

}
