function getName(){
console.log('Tried getting name');
    var ABI = [{"constant":false,"inputs":[{"name":"desiredUsername","type":"string"}],"name":"Register","outputs":[{"name":"sender","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_useradress","type":"address"}],"name":"getUsername","outputs":[{"name":"username","type":"string"}],"payable":false,"type":"function"}]
;
    var contractAddress="0x507e049d16c2827ccf603aa2fd882d4a93bec25e";
    var contract = web3.eth.contract(ABI);
    var contractInstance=contract.at(contractAddress);
    var name=contractInstance.getUsername.call();
    gameInstance.SendMessage('UIController', 'SetName', name);
}	
function setName(name){
   var ABI = [{"constant":false,"inputs":[{"name":"desiredUsername","type":"string"}],"name":"Register","outputs":[{"name":"sender","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_useradress","type":"address"}],"name":"getUsername","outputs":[{"name":"username","type":"string"}],"payable":false,"type":"function"}];
   var contractAddress="0x507e049d16c2827ccf603aa2fd882d4a93bec25e";
    var contract = web3.eth.contract(ABI);
    var contractInstance=contract.at(contractAddress);
    contractInstance.Register(name,function(error, result){
     if(!error){
         console.log(result);
         getName();
     }
     else
         console.error(error);
 }); 
}
