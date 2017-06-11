pragma solidity ^0.4.8;

import './common/Ownable.sol';
import './common/Common.sol';
import './CourseRegistry.sol';

//*********************************************************************
//* @title Course
//* @dev 
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract Course is Ownable{

    //***********************
    //* Structure and enums     
    //*

    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant

    // Variables  
    address         registry;
    address         studentAddress;
    address         teacherAddress;
    uint            startDateTime;
    uint            endDateTime;
    uint            amount;
    Common.Level    level;
    bytes           description;
    Common.State    state;

    //***********************/
    
    
    //***********************
    //* Modifier    
    //*
    modifier onlyStudent {
        if (msg.sender != studentAddress) throw;
        _;
    }
    modifier onlyTeacher {
        if (msg.sender != teacherAddress) throw;
        _;
    }
    modifier onlyIfState(Common.State _state) {
        if (state != _state) throw;
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
    function Course(address _registry, address _studentAddress, address _teacherAddress, uint _startDateTime, uint _endDateTime, uint _amount, bytes _description, Common.Level _level) {  
        registry        = _registry;
        studentAddress  = _studentAddress;
        teacherAddress  = _teacherAddress;
        startDateTime   = _startDateTime;
        endDateTime     = _endDateTime;
        amount          = _amount;
        description     = _description;
        level           = _level;
        state           = Common.State.CREATED;
    }
    //***********************/

    
    //***********************
    //* Getter   
    //*
    function getCourseDetails() constant returns  (address _studentAddress, address _teacherAddress, uint _startDateTime, uint _endDateTime, uint _amount, Common.State, Common.Level, bytes) {
    
        return (studentAddress, teacherAddress, startDateTime, endDateTime, amount, state, level, description); 
    }
    //***********************/
    
    
    //***********************
    //* Public functions    
    //*
    function makePayment() payable onlyStudent onlyIfState(Common.State.CREATED) {
        if(msg.value != amount) {
            throw;
        }
        
        state = Common.State.PAID;
        CourseRegistry reg = CourseRegistry(registry);
        reg.updateState(this, state);

    }
    
    function release() onlyTeacher onlyIfState(Common.State.PAID) {

        if (!teacherAddress.send(amount)) {
            throw;
        }
        
        state = Common.State.ENDED;
        CourseRegistry reg = CourseRegistry(registry);
        reg.updateState(this, state);
    }
    
    function refund() onlyTeacher onlyIfState(Common.State.PAID) {
    
        if (!studentAddress.send(amount)) {
            throw;
        }
    
        state = Common.State.REFUNDED;
        CourseRegistry reg = CourseRegistry(registry);
        reg.updateState(this, state);
    }
  
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/
    

}
