var swarm = Swarm.at("http://swarm-gateways.net");
function onContentLoaded() {
  var accountSpan = document.getElementById("account");
  accountSpan.innerHTML =

    (typeof web3 === "undefined" ? "undefined" : web3.eth.accounts);
}
document.addEventListener("DOMContentLoaded", onContentLoaded);

var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "int256" } ], "name": "images", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "hash", "type": "string" } ], "name": "post", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "id", "outputs": [ { "name": "", "type": "int256", "value": "0" } ], "payable": false, "type": "function" } ];
        
var contract = web3.eth.contract(abi).at("0x3658D5C380ed515125De258B50e3325080234279");

contract.id.call(function(err, res){
    var id = res.toNumber();
    var latestid = id - 1;
    var recent = contract.images(latestid);
    swarm.download(recent).then(function(buffer) {
        imageData = JSON.parse(buffer.toString());
        document.getElementById("recentimagecaption").innerHTML = imageData.caption;
        document.getElementById("recentimage").src = imageData.image;
    });
    
    document.getElementById("recentimagecaption").href = "i.html?i=" + recent;
});

