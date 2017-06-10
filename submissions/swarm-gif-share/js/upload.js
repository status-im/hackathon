var swarm = Swarm.at("http://swarm-gateways.net");
var chosenImage = "";
window.onload = function onpageload() {
    var img1_element = document.getElementById("file1");
    var img2_element = document.getElementById("file2");
    var img3_element = document.getElementById("file3");
    var img4_element = document.getElementById("file4");
    
    jQuery.get("./file1.txt", function(data) {
        img1_element.src = data.toString();
    });
    
    jQuery.get("./file2.txt", function(data) {
        img2_element.setAttribute("src", data);
    });
    
    jQuery.get("./file3.txt", function(data) {
        img3_element.setAttribute("src", data);
    });
    
    jQuery.get("./file4.txt", function(data) {
        img4_element.setAttribute("src", data);
    });
};

function choose1() {
    chosenImage = document.getElementById("file1").src;
    $("#myModal").modal("hide");
    document.getElementById("imgpreview").src = document.getElementById("file1").src;
    document.getElementById("imgpreview").style.display = "inline";
    document.getElementById("info-fields").style.display = "inline";
    document.getElementById("uploadbtn").style.display = "inline";
}

function choose2() {
    chosenImage = document.getElementById("file2").src;
    $("#myModal").modal("hide");
    document.getElementById("imgpreview").src = document.getElementById("file2").src;
    document.getElementById("imgpreview").style.display = "inline";
    document.getElementById("info-fields").style.display = "inline";
    document.getElementById("uploadbtn").style.display = "inline";
}

function choose3() {
    chosenImage = document.getElementById("file3").src;
    $("#myModal").modal("hide");
    document.getElementById("imgpreview").src = document.getElementById("file3").src;
    document.getElementById("imgpreview").style.display = "inline";
    document.getElementById("info-fields").style.display = "inline";
    document.getElementById("uploadbtn").style.display = "inline";
}

function choose4() {
    chosenImage = document.getElementById("file4").src;
    $("#myModal").modal("hide");
    document.getElementById("imgpreview").src = document.getElementById("file4").src;
    document.getElementById("imgpreview").style.display = "inline";
    document.getElementById("info-fields").style.display = "inline";
    document.getElementById("uploadbtn").style.display = "inline";
}
// Image upload is commented out because it does not work in Status at this moment.

//// Show file preview
//function previewFile() {
    //// Get file
    //var file = img_upload.files[0];
    //var reader = new FileReader();
    
    //reader.addEventListener("load", function () {
        //// Display image preview
        //preview.src = reader.result;
        //preview.style.display = "inline";
        
        //// Show caption field        
        //document.getElementById("info-fields").style.display = "inline";
        
        //var base64_hash = reader.result;
    //}, false);

    //if (file) {
        // Base 64 Encode
        //reader.readAsDataURL(file);
    //}
//}

function uploadFile() {
    
    // Create JSON to upload
    var info = new Object();
    info.image = chosenImage;
    info.caption = document.getElementById("imgcaption-input").value;
    info.poster = web3.eth.accounts[0];
    var infoString = JSON.stringify(info);
    swarm.upload(new Buffer(infoString)).then(function(hash) {
        var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "int256" } ], "name": "images", "outputs": [ { "name": "", "type": "string", "value": "" } ], "payable": false, "type": "function" }, { "constant": false, "inputs": [ { "name": "hash", "type": "string" } ], "name": "post", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "id", "outputs": [ { "name": "", "type": "int256", "value": "0" } ], "payable": false, "type": "function" } ];
        
        var contract = web3.eth.contract(abi).at("0x3658D5C380ed515125De258B50e3325080234279");
        var sender = web3.eth.accounts[0];
        contract.post.sendTransaction(hash, {from: sender, gas: 110000}, function(err) {
            if (!err) {
                window.location.href = "i.html?i=" + hash;
            } else {
                console.log("Oops, something went wrong :(");            }
        });
    });
        
}