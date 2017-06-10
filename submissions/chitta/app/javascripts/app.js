// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import chitta_artifacts from '../../build/contracts/Chitta.json'

import users_artifacts from '../../build/contracts/Users.json'
// Products is our usable abstraction, which we'll use through the code below.
var Chitta = contract(chitta_artifacts);

var Users = contract(users_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;
var sm;
var myclaimcount;

var myassociationcount;
var myassociationclaims;

var myclaims;

var claimLocations;

window.App = {
  start: function() {
    var self = this;

    // Bootstrap the Products abstraction for Use.
    Chitta.setProvider(web3.currentProvider);
    Users.setProvider(web3.currentProvider);
    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];
    });
  },
  userLogin : function() {
    var username = $('#username').val();
    var password = $('#password').val();
    if (username == '') {
        alert ("Username is empty!");
        return;
    } else if (password == '') {
        alert ("Password is empty!");
        return;
    }

    var self = this;
    var users;
    Users.deployed().then(function(instance){
      users = instance;
      return users.loginUser.call(username, password);
    }).then(function(detail) {
      if (detail[0]) {
        $('#username').val('');
        $('#password').val('');
        localStorage.setItem('username', username);
        localStorage.setItem('fullname', detail[1]);
        localStorage.setItem('userAccount', detail[2]);
        window.location.href = "home.html";
      } else {
        alert ("Username and password doesn't match, please try again!");
        return;
      }
    });
  },
  logoutUser : function() {
    localStorage.removeItem('username');
    localStorage.removeItem('fullname');
    localStorage.removeItem('userAccount');
    localStorage.removeItem('selectedArea');
    localStorage.removeItem('selectedCoordinates');
    window.location.href = "index.html";
  },
  validateUserAndShowUsername : function() {
    var loginUser = localStorage.getItem('username');
    if (loginUser != undefined && loginUser != null) {
      var displayName = localStorage.getItem('fullname');
      $('#currentUserName').html(displayName);
    } else {
        window.location.href = "index.html";
    }
  },
  getUrlParameter: function (sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : sParameterName[1];
        }
    }
  },
  validateUserAndShowUsernameAndViewMyClaimMap : function() {
    var self = this;
    var loginUser = localStorage.getItem('username');
    if (loginUser != undefined && loginUser != null) {
      var displayName = localStorage.getItem('fullname');
      $('#currentUserName').html(displayName);
      sm = new ScribbleMap(document.getElementById('ScribbleMap'), {startCenter: [12.6733338,79.2756915], startZoom: 15, lineSettingsControl: false, fillColorControl: false, lineColorControl: false, searchControl:false, tools: []});
      sm.ui.setStyle({
        lineColor: '#1ec500',
        lineOpacity: 1,
        fillColor: '#1ec500',
        fillOpacity: 0.5,
        weight: 3
      });
      var type = App.getUrlParameter("type");
      if (type == "viewall") {
        var getMyClaims = localStorage.getItem('myclaims');
        var getMyClaimsArr = getMyClaims.split(',');
        if (getMyClaimsArr.length > 0) {
          claimLocations = new Array();
          self.drawPolyOnMap(getMyClaimsArr, 0, 0);
        }
      } else if (type == "viewsingle") {
        var selectedClaim = localStorage.getItem('selectedCode');
        if (selectedClaim != undefined && selectedClaim != null) {
            var getMyClaimsArr = [selectedClaim];
            claimLocations = new Array();
            self.drawPolyOnMap(getMyClaimsArr, 0, 0);
        }
      }

    } else {
        window.location.href = "index.html";
    }
  },
  validateUserAndShowUsernameAndViewMyAssociationClaimMap : function() {
    var self = this;
    var loginUser = localStorage.getItem('username');
    if (loginUser != undefined && loginUser != null) {
      var displayName = localStorage.getItem('fullname');
      $('#currentUserName').html(displayName);
      sm = new ScribbleMap(document.getElementById('ScribbleMap'), {startCenter: [12.6733338,79.2756915], startZoom: 15, lineSettingsControl: false, fillColorControl: false, lineColorControl: false, searchControl:false, tools: []});
      sm.ui.setStyle({
        lineColor: '#1ec500',
        lineOpacity: 1,
        fillColor: '#1ec500',
        fillOpacity: 0.5,
        weight: 3
      });
      var type = App.getUrlParameter("type");
      if (type == "viewall") {
        var getMyClaims = localStorage.getItem('associationclaims');
        var getMyClaimsArr = getMyClaims.split(',');
        if (getMyClaimsArr.length > 0) {
          claimLocations = new Array();
          self.drawPolyOnMap(getMyClaimsArr, 0, 0);
        }
      } else if (type == "viewsingle") {
        var selectedClaim = localStorage.getItem('selectedCode');
        if (selectedClaim != undefined && selectedClaim != null) {
            var getMyClaimsArr = [selectedClaim];
            claimLocations = new Array();
            self.drawPolyOnMap(getMyClaimsArr, 0, 0);
        }
      }

    } else {
        window.location.href = "index.html";
    }
  },
  drawPolyOnMap : function(claimsArr, index, coor) {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getCoordinates.call(claimsArr[index], coor);
    }).then(function(coordinates) {
      if(coordinates != "") {
        claimLocations.push(coordinates);
        self.drawPolyOnMap(claimsArr, index, (coor + 1));
      } else {
        var polyArr = new Array();
        for (var i = 0; i < claimLocations.length; i++) {
          var latlong = claimLocations[i].split(",");
          var latlongArr = [latlong[0], latlong[1]];
          if (i == 0) {
            sm.draw.marker(latlongArr);
          }
          polyArr.push(latlongArr);
        }
        sm.draw.poly(polyArr);
        index++;
        if (claimsArr.length > index) {
          claimLocations = new Array();
          self.drawPolyOnMap(claimsArr, index, 0);
        }
      }
    });
  },
  validateUserAndShowUsernameAndViewMap : function() {
    var loginUser = localStorage.getItem('username');
    if (loginUser != undefined && loginUser != null) {
      var displayName = localStorage.getItem('fullname');
      $('#currentUserName').html(displayName);
      sm = new ScribbleMap(document.getElementById('ScribbleMap'), {startCenter: [12.6733338,79.2756915], startZoom: 15, lineSettingsControl: false, fillColorControl: false, lineColorControl: false, searchControl:false, tools: ["polygon", "eraser", "drag"]});
      sm.ui.setStyle({
        lineColor: '#1ec500',
        lineOpacity: 1,
        fillColor: '#1ec500',
        fillOpacity: 0.5,
        weight: 3
      });
    } else {
        window.location.href = "index.html";
    }
  },
  getDrewnArea: function() {
    var geoData = sm.data.getGeoJSON();
    var overlays = sm.map.getOverlays();
    if(geoData.features.length == 0) {
      alert ("No area is marked");
      return;
    } else if (geoData.features.length > 1) {
      alert ("Morethen one area marked, please select only one area at a time!");
      return;
    } else {
      var area = parseInt(overlays[0].getArea("sqft"));
      var coordinates = geoData.features[0].geometry.coordinates[0];
      localStorage.setItem('selectedArea', area);
      localStorage.setItem('selectedCoordinates', coordinates);
      window.location.href = "claimdetail.html";
    }
  },
  loadNewClaimDetail : function() {
    var area = localStorage.getItem('selectedArea');
    if (area != undefined && area != null) {
      $('#size').val(area);
    } else {
      window.location.href = "home.html";
    }
  },
  addNewClaim : function() {
    var landname = $('#landname').val();
    var chittacode = $('#chittacode').val();
    var usage = $('#usage').val();
    var size = parseInt($('#size').val());
    var rainwater = parseInt($('#rainwater').val());
    var fromhighway = parseInt($('#fromhighway').val());
    var iscity = $("#newClaimScreen input[type='radio']:checked").val();
    var acc = localStorage.getItem('userAccount');

    if (landname == '') {
      alert ("Land name is empty!");
      return;
    } else if (chittacode == '') {
        alert ("Chitta code is empty!");
        return;
    } else if (usage == '') {
        alert ("Usage is empty!");
        return;
    } else if (isNaN(size)) {
        alert ("Size is empty!");
        return;
    } else if (isNaN(rainwater) || parseInt(rainwater) < 1) {
        alert ("Rainwater is empty!");
        return;
    } else if (isNaN(fromhighway) || parseInt(fromhighway) < 1) {
        alert ("Kr from highway is empty!");
        return;
    } else if (acc == undefined || acc == null) {
      window.location.href = "index.html";
    }
    $('#addClaimButton').prop('disabled', true);
    $('#loadingDiv').show();
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.validateChittaCode.call(chittacode);
    }).then(function(available) {
      if (available) {
        self.addClaimAfterValidateChittaCodeAvailability(landname, chittacode, usage, acc);
      } else {
        $('#addClaimButton').prop('disabled', false);
        $('#loadingDiv').hide();
        alert ("Chitta code is already used. Please validate and provide correct code!");
        return;
      }

    });
  },
  addClaimAfterValidateChittaCodeAvailability: function(landname, chittacode, usage, acc) {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.createNewClaim(landname, chittacode, usage, acc, {from: account, gas: 4712388});
    }).then(function(res) {
      self.setStatus("Claim creation is in progress!");
      self.getClaimCurrentIndex(chittacode);
    });
  },
  getClaimCurrentIndex: function(chittacode) {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getClaimIndex.call(chittacode);
    }).then(function(index) {
      if (index > 0) {
        self.addClaimLocation(index - 1, 0);
      } else {
        $('#addClaimButton').prop('disabled', false);
        $('#loadingDiv').hide();
        self.setStatus("Sorry, Could not create your claim. Please try again!");
      }
    });
  },
  addClaimLocation: function(index, current) {
    var coordinates = localStorage.getItem('selectedCoordinates');
    var self = this;
    var chitta;

    var coordinatesArr = coordinates.split(',');
    if (coordinatesArr.length > (current + 1)){
      var latitude = coordinatesArr[current + 1];
      var longitude = coordinatesArr[current];
      var last = false;
      if (coordinatesArr.length == (current + 2)) {
        last = true;
      }
      Chitta.deployed().then(function(instance){
        chitta = instance;
        return chitta.addCoordinate(index, latitude, longitude, last, {from: account, gas: 4712388});
      }).then(function(res) {
        if (last) {
          localStorage.removeItem('selectedCoordinates');
          self.setStatus("Claim - Location is added...");
          self.addClaimPriceProperties(index);
        } else {
          self.setStatus("Claim - adding location is in progress!");
          self.addClaimLocation(index, (current + 2));
        }
      });
    }
  },
  addClaimPriceProperties : function(index) {
    var size = parseInt($('#size').val());
    var rainwater = parseInt($('#rainwater').val());
    var fromhighway = parseInt($('#fromhighway').val());
    var iscity = $("#newClaimScreen input[type='radio']:checked").val();

    var self = this;
    var chitta;

    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.addPriceProperties(index, size, rainwater, fromhighway, iscity, {from: account, gas: 4712388});
    }).then(function(res) {
      self.setStatus("Claim - Price calucated. In progress...");
      localStorage.removeItem('selectedArea');
      self.checkAndAddReviewer(index);
    });
  },
  checkAndAddReviewer: function(index) {
    var self = this;
    var acc = localStorage.getItem('userAccount');
    var users;
    Users.deployed().then(function(instance){
      users = instance;
      return users.getReviewers.call(acc);
    }).then(function(detail) {
      if (detail[0]) {
        self.addClaimReviewer(index, detail[1], detail[2], detail[3]);
      } else {
        self.setStatus("Claim created successful!!! <br> We will ask 3 (minimum) other association members near you if they can pledge that you are the rightfull owner of this land.");
        $('#addClaimButton').prop('disabled', false);
        $('#loadingDiv').hide();
        $('#landname').val('');
        $('#chittacode').val('');
        $('#usage').val('');
        $('#size').val('');
        $('#rainwater').val('');
        $('#fromhighway').val('');
        alert ("Claim created successful!!! We will ask 3 (minimum) other association members near you if they can pledge that you are the rightfull owner of this land.");
        window.location.href = "home.html";
      }
    });
  },
  addClaimReviewer: function(index, reviewer1, reviewer2, reviewer3) {
    var self = this;
    var chitta;

    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.addAllReviwer(index, reviewer1, reviewer2, reviewer3, {from: account, gas: 4712388});
    }).then(function(res) {
      self.setStatus("Claim created successful!!! <br> We asked 3 (minimum) other association members near you if they can pledge that you are the rightfull owner of this land.");
      $('#addClaimButton').prop('disabled', false);
      $('#loadingDiv').hide();
      $('#landname').val('');
      $('#chittacode').val('');
      $('#usage').val('');
      $('#size').val('');
      $('#rainwater').val('');
      $('#fromhighway').val('');
      alert ("Claim created successful!!! We asked 3 (minimum) other association members near you if they can pledge that you are the rightfull owner of this land.");
      window.location.href = "home.html";
    });
  },
  showMapToClaim: function() {
    $('#confirmMessage').show();
    $('#claimList').hide();
    $('#introMessage').hide();
  },
  registerNewUser: function() {
    var fullname = $('#fullname').val();
    var username = $('#username').val();
    var password = $('#password').val();
    var confirmPassword = $('#confirmPassword').val();

    var self = this;

    if (fullname == '') {
      alert ("Fullname is empty!");
      return;
    } else if (username == '') {
        alert ("Username is empty!");
        return;
    } else if (password == '') {
        alert ("Password is empty!");
        return;
    } else if (confirmPassword == '') {
        alert ("Confirm password is empty!");
        return;
    } else if (confirmPassword != password) {
        alert ("Password do not match!");
        return;
    }
    self.checkUsernameAvailable(username, fullname, password);
  },
  checkUsernameAvailable : function(username, fullname, userpass) {
    var self = this;
    var users;
    Users.deployed().then(function(instance){
      users = instance;
      return users.validateUsername.call(username, {from: account});
    }).then(function(status) {
      if (status) {
        self.createAccount(username, fullname, userpass);
      } else {
        alert ("Username is not available, please try again!");
        return;
      }
    });
  },
  createAccount: function(username, fullname, userpass){
    var self = this;
    web3.personal.newAccount(userpass, function(err, acc) {
      self.registerUser(username, fullname, userpass, acc);
    });
  },
  registerUser: function(username, fullname, userpass, acc) {
    var self = this;
    var users;
    Users.deployed().then(function(instance){
      users = instance;
      return users.addUser(username, userpass, fullname, acc, {from: account, gas: 4712388});
    }).then(function() {
      $('#fullname').val('');
      $('#username').val('');
      $('#password').val('');
      $('#confirmPassword').val('');
      self.setStatus("User registration is successful!");
      alert ("User registration is successful!");
      window.location.href = "index.html";
    });
  },
  loadExchange : function() {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getClaimCount.call();
    }).then(function(count) {
      if (parseInt(count) > 0) {
        // Load Claims
        self.clearExchangeTable();
        self.getExchangeClaimDetail(parseInt(count), 0, 0);
      } else {
        $('#exchangeIntro').show();
      }
    });
  },
  loadMyAssocation : function() {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getClaimCount.call();
    }).then(function(count) {
      if (parseInt(count) > 0) {
        // Load Claims
        $('#myassociationIntroMessage').hide();
        $('#myassociationClaimList').show();
        myassociationclaims = new Array();
        self.clearAssoicationTable();
        self.getAssociationClaimDetail(parseInt(count), 0);
      } else {
        $('#myassociationIntroMessage').show();
      }
    });
  },
  loadClaims: function() {
    $('#confirmMessage').hide();
    var self = this;
    var chitta;
    var userAccount = localStorage.getItem('userAccount');
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getUserClaimCount.call(userAccount);
    }).then(function(count) {
      if (parseInt(count[0]) > 0) {
        // Load Claims
        $('#claimList').show();
        myclaimcount = 0;
        myclaims = new Array();
        self.clearTable();
        if (parseInt(count[1]) > 0){
          self.getClaimDetail(parseInt(count[1]), 0, userAccount, 0);
        }
      } else {
        $('#introMessage').show();
      }
    });
  },
  getAssociationClaimDetail : function(claimTotal, currentIndex){
    var self = this;
    var chitta;
    var acc = localStorage.getItem('userAccount');
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getAssociationClaimDetail.call(currentIndex, acc, {from: account});
    }).then(function(detail) {
      var table = document.getElementById("associationclaims");
      var row = table.insertRow((currentIndex+1));
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      var cell3 = row.insertCell(2);
      var cell4 = row.insertCell(3);
      var cell5 = row.insertCell(4);
      var cell6 = row.insertCell(5);
      var cell7 = row.insertCell(6);
      var cell8 = row.insertCell(7);

      cell1.innerHTML = (currentIndex+1);
      cell2.innerHTML = detail[0];
      cell3.innerHTML = detail[1];
      cell4.innerHTML = detail[2];
      cell5.innerHTML = detail[3] + ' sq feet';
      cell6.innerHTML = self.getStage(detail[4]);
      cell7.innerHTML = "<button onclick='App.showAssociationSingle(\"" + detail[0] + "\")'>Map</button> " +
                        "<button onclick='App.showQueryPage(\"" + detail[0] + "\", \"" + detail[1] + "\")'>Query</button>";
      cell8.innerHTML = self.getReviewButton(detail[0], detail[5]);
      myassociationclaims.push(detail[0]);

      currentIndex++;
      if (claimTotal > currentIndex) {
        self.getAssociationClaimDetail(claimTotal, currentIndex);
      } else {
        $('#associationClaimCount').html(claimTotal);
        localStorage.setItem('associationclaims', myassociationclaims);
      }
    }).catch(function(e) {
      console.log(e);
    });
  },
  getExchangeClaimDetail : function(claimTotal, currentIndex, rowIndex){
    var self = this;
    var chitta;
    var acc = localStorage.getItem('userAccount');
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getAssociationClaimDetail.call(currentIndex, acc, {from: account});
    }).then(function(detail) {
      if (parseInt(detail[4]) == 4) {
        var table = document.getElementById("exchangeclaims");
        var row = table.insertRow((rowIndex+1));
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);
        var cell8 = row.insertCell(7);

        cell1.innerHTML = (rowIndex+1);
        cell2.innerHTML = detail[0];
        cell3.innerHTML = detail[1];
        cell4.innerHTML = detail[2];
        cell5.innerHTML = detail[3] + ' sq feet';
        cell6.innerHTML = self.getStage(detail[4]);
        cell7.innerHTML = "<button onclick='App.showAssociationSingle(\"" + detail[0] + "\")'>Map</button> ";
        cell8.innerHTML = "<button onclick='alert(\"In Progress\")'>Buy</button>";
        rowIndex++;
      }
      currentIndex++;
      if (claimTotal > currentIndex) {
        self.getExchangeClaimDetail(claimTotal, currentIndex, rowIndex);
      } else {
        $('#exchangeclaimCount').html(rowIndex);
        if (rowIndex > 0) {
          $('#exchangeIntro').hide();
          $('#exchnageClaimList').show();
        }
      }
    }).catch(function(e) {
      console.log(e);
    });
  },
  getClaimDetail: function(claimTotal, currentIndex, userAccount, rowIndex){
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getClaim.call(currentIndex, userAccount, {from: account});
    }).then(function(detail) {
      if (detail[0] != "") {
        myclaimcount = myclaimcount + 1;
        var table = document.getElementById("claims");
        var row = table.insertRow((rowIndex+1));
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        var cell4 = row.insertCell(3);
        var cell5 = row.insertCell(4);
        var cell6 = row.insertCell(5);
        var cell7 = row.insertCell(6);

        cell1.innerHTML = (rowIndex+1);
        cell2.innerHTML = detail[0];
        cell3.innerHTML = detail[1];
        cell4.innerHTML = detail[2];
        cell5.innerHTML = detail[3] + ' sq feet';
        cell6.innerHTML = self.getStage(detail[4]);
        cell7.innerHTML = "<button onclick='App.showSingle(\"" + detail[1] + "\")'>Map</button> <button onclick='App.claimReviwerStatus(\"" + detail[1] + "\")'>Reviewer Status</button>";
        myclaims.push(detail[1]);
        $('#claimCount').html(myclaimcount);
        rowIndex++;
      }

      currentIndex++;
      if (claimTotal > currentIndex) {
        self.getClaimDetail(claimTotal, currentIndex, userAccount, rowIndex);
      } else {
        localStorage.setItem('myclaims', myclaims);
      }
    }).catch(function(e) {
      console.log(e);
    });
  },
  showSingle : function(code) {
    localStorage.setItem('selectedCode', code);
    window.location.href = "myclaiminmap.html?type=viewsingle";
  },
  showAssociationSingle: function(code) {
    localStorage.setItem('selectedCode', code);
    window.location.href = "myassociationclaiminmap.html?type=viewsingle";
  },
  showQueryPage: function(code, usage) {
    localStorage.setItem('selectedCode', code);
    localStorage.setItem('selectedUsage', usage);
    window.location.href = "myassociationquery.html";
  },
  loadQueryPage: function() {
    var selectedClaim = localStorage.getItem('selectedCode');
    $('#selectedCode').html("Code : " + selectedClaim);
  },
  queryAnswer: function() {
    var query = $('#questionSelect').val();
    if(query == undefined || query == '') {
      alert ("Please select the question and try again!");
      $('#answerDiv').html('');
      return;
    }
    var selectedClaim = localStorage.getItem('selectedCode');
    var self = this;
    var chitta;

    if (query == "price") {
        Chitta.deployed().then(function(instance){
          chitta = instance;
          return chitta.getQueryAnswers.call(selectedClaim, {from: account});
        }).then(function(price) {
          $('#answerDiv').html("The price of this land is Rs. " + parseInt(price[2]).toLocaleString('en-IN', { maximumSignificantDigits: 3 }));
        });
    } else if (query == "review") {
      Chitta.deployed().then(function(instance){
        chitta = instance;
        return chitta.getReviewerStatus.call(selectedClaim, {from: account});
      }).then(function(reviewers) {
        var message = '<table id="reviewStatusTable"> <tbody><tr> <th> User </th> <th> Status </th> </tr>';
        var statusMessage = "<span style='color: #808080'>PENDING</span>";
        if(reviewers[1] == 1) {
          statusMessage = "<span style='color: #00e600'>APPROVED</span>";
        } else if (reviewers[1] == 2) {
          statusMessage = "<span style='color: red'>DENIED</span>";
        }
        message += '<tr><td>' + reviewers[0] + '</td><td>' + statusMessage + '</td></tr>';
        statusMessage = "<span style='color: #808080'>PENDING</span>";
        if(reviewers[3] == 1) {
          statusMessage = "<span style='color: #00e600'>APPROVED</span>";
        } else if (reviewers[3] == 2) {
          statusMessage = "<span style='color: red'>DENIED</span>";
        }
        message += '<tr><td>' + reviewers[2] + '</td><td>' + statusMessage + '</td></tr>';
        statusMessage = "<span style='color: #808080'>PENDING</span>";
        if(reviewers[5] == 1) {
          statusMessage = "<span style='color: #00e600'>APPROVED</span>";
        } else if (reviewers[5] == 2) {
          statusMessage = "<span style='color: red'>DENIED</span>";
        }
        message += '<tr><td>' + reviewers[4] + '</td><td>' + statusMessage + '</td></tr>';
        message += '</tbody> </table>';
        $('#answerDiv').html(message);
      });
    } else if (query == "highway") {
      Chitta.deployed().then(function(instance){
        chitta = instance;
        return chitta.getQueryAnswers.call(selectedClaim, {from: account});
      }).then(function(highway) {
        $('#answerDiv').html("The land is " + parseInt(highway[1]) + " km away from highway.");

      });
    } else if (query == "usage") {
        var usage = localStorage.getItem('selectedUsage');
        $('#answerDiv').html("The current usage of this land is " + usage + ".");
    } else if (query == "rainwater") {
      Chitta.deployed().then(function(instance){
        chitta = instance;
        return chitta.getQueryAnswers.call(selectedClaim, {from: account});
      }).then(function(rainwater) {
        $('#answerDiv').html("The amount of rainwater fallen per m2 since last year is " + parseInt(rainwater[0]) + ".");
      });
    }
  },
  clearTable: function(){
     var table = document.getElementById("claims");
     var rowCount = table.rows.length;
     for (var i = 1; i < rowCount; i++) {
        table.deleteRow(1);
     }
  },
  clearAssoicationTable: function(){
     var table = document.getElementById("associationclaims");
     var rowCount = table.rows.length;
     for (var i = 1; i < rowCount; i++) {
        table.deleteRow(1);
     }
  },
  clearExchangeTable: function(){
     var table = document.getElementById("exchangeclaims");
     var rowCount = table.rows.length;
     for (var i = 1; i < rowCount; i++) {
        table.deleteRow(1);
     }
  },
  getStage: function (value) {
    var status = '';
    if (value == 0) {
      status = '<span class="created">CREATED</span>';
    } else if (value == 1) {
      status = '<span class="located">LOCATED</span>';
    } else if (value == 2) {
      status = '<span class="pricecalcuated">PRICE CALCULATED</span>';
    } else if (value == 3) {
      status = '<span class="review">REVIEW</span>';
    }else if (value == 4) {
      status = '<span class="readyforsale">READY FOR SALE</span>';
    }
    return status;
  },
  updateReviewStatus :  function(index, status) {
    var self = this;
    var chitta;
    var acc = localStorage.getItem('userAccount');
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.updateReviewerStatus(index, acc, status, {from: account, gas: 4712388});
    }).then(function(index) {
      self.setStatus("Successfully updated review status!");
      self.loadMyAssocation();
    });
  },
  closeDialog : function() {
    var dialog = document.getElementById('statusDialog');
    dialog.close();
  },
  clearStatusTable: function() {
    var table = document.getElementById("reviewStatusTable");
    var rowCount = table.rows.length;
    for (var i = 1; i < rowCount; i++) {
       table.deleteRow(1);
    }
  },
  addStatusRow: function(reviewer, status, rowCount) {
    var table = document.getElementById("reviewStatusTable");
    var row = table.insertRow(rowCount);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell1.innerHTML = reviewer;
    var statusMessage = "<span style='color: #808080'>PENDING</span>";
    if(status == 1) {
      statusMessage = "<span style='color: #00e600'>APPROVED</span>";
    } else if (status == 2) {
      statusMessage = "<span style='color: red'>DENIED</span>";
    }
    cell2.innerHTML = statusMessage;
  },
  claimReviwerStatus : function(code) {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getReviewerStatus.call(code, {from: account});
    }).then(function(reviewers) {
      //alert (reviewers[0]);
      self.clearStatusTable();
      self.addStatusRow(reviewers[0], reviewers[1], 1);
      self.addStatusRow(reviewers[2], reviewers[3], 2);
      self.addStatusRow(reviewers[4], reviewers[5], 3);

      var dialog = document.getElementById('statusDialog');
      dialog.show();
    });
  },
  reviewOtherCliam : function(code, status) {
    var self = this;
    var chitta;
    Chitta.deployed().then(function(instance){
      chitta = instance;
      return chitta.getClaimIndex.call(code, {from: account});
    }).then(function(index) {
      if (index > 0) {
        self.updateReviewStatus(parseInt(index - 1), status);
      } else {
        self.setStatus("Sorry, Could not review the cliam. Please try again!");
      }
    });
  },
  getReviewButton: function (code, value) {
    var review = '';
    if (value == 1) {
      review = '<button onclick="App.reviewOtherCliam(\'' + code  + '\', 1)" style="background-color: #00e600;">Approve</button> <button onclick="App.reviewOtherCliam(\'' + code  + '\', 2)" style="background-color: red;">Deny</button>';
    } else if (value == 2) {
      review = '<span class="located" style="background-color: #00e600;">APPROVED</span>';
    } else if (value == 3) {
      review = '<span class="pricecalcuated" style="background-color: red;">DENIED</span>';
    }
    return review;
  },
  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
    status.style.display = 'block';
    setTimeout(function() {
      var status = document.getElementById("status");
      status.style.display = 'none';
    },10000);
  }
};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MetaCoin, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://10.0.0.14:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://10.0.0.14:8545"));
  }

  App.start();
});
