pragma solidity ^0.4.8;

import './common/Ownable.sol';

//*********************************************************************
//* @title TeacherRegistry
//* @dev 
//* @author Gregoire JEANMART <gregoire.jeanmart at gmail.com> 
//*********************************************************************
contract TeacherRegistry is Ownable {

    //***********************
    //* Structure and enums     
    //*
    struct Teacher {
        address teacherAddress;
        bytes32 teacherName;
    }
    //***********************/

    //***********************
    //* Data                
    //*
     
    // Constant

    // Variables  
    mapping(address => Teacher)    teacherRegistery;

    //***********************/
    
    
    //***********************
    //* Modifier    
    //*

    //***********************
    
    
    //***********************
    //* Events      
    //*

    //***********************/
    
    
    //***********************
    //* Constructor    
    //*
    function TeacherRegistry() {  }
    //***********************/

    
    //***********************
    //* Getter   
    //*
    function getTeacherInfo(address _teacherAddress) constant returns (bytes32, address) {
        return (teacherRegistery[_teacherAddress].teacherName, teacherRegistery[_teacherAddress].teacherAddress); 
    }
    
    function isTeacher() constant returns (bool isTeacher) {
        return (teacherRegistery[msg.sender].teacherAddress != address(0x0)); 
    }
    //***********************/
    
    
    //***********************
    //* Public functions    
    //*
    function registerTeacher(address _teacherAddress, bytes32 _teacherName, bool disable) onlyOwner {
        
        // Register the teacher
        Teacher memory teacher; 
        if(disable == true) {
            teacher.teacherAddress  = address(0x0);
        } else {
            teacher.teacherAddress  = _teacherAddress;
        }
        teacher.teacherName     = _teacherName;
        
        teacherRegistery[_teacherAddress] = teacher;
        
    }
  
    //***********************/
     
     
     
    //***********************
    //* Private functions       
    //*
    
    //***********************/
    

}
