const request = require('request');

function fromAscii(str) {
    var hex = "";
    for(var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        var n = code.toString(16);
        hex += n.length < 2 ? '0' + n : n;
    }
    return "0x" + hex;
};

var StatusDev = function(options) {
    this.url = "http://" + options.ip + ":5561";
};

function requestOptions(url, body) {
    return {
        url: url,
        method: "POST",
        timeout: 3000,
        json: true,
        body: body};
}

StatusDev.prototype.addContact = function(contactData, cb) {
    request(requestOptions(this.url + "/add-dapp", { encoded: fromAscii(contactData) })
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

StatusDev.prototype.removeContact = function(contactData, cb) {
    request(requestOptions(this.url + "/remove-dapp", { encoded: fromAscii(contactData) })
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

StatusDev.prototype.refreshContact = function(contactData, cb) {
    request(requestOptions(this.url + "/dapp-changed", { encoded: fromAscii(contactData) })
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

StatusDev.prototype.switchNode = function(rpcUrl, cb) {
    request(requestOptions(this.url + "/switch-node", {encoded: fromAscii(JSON.stringify({"url": rpcUrl}))})
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

StatusDev.prototype.listDApps = function(cb) {
    request(requestOptions(this.url + "/list", {})
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

StatusDev.prototype.getLog = function(identity, cb) {
    request(requestOptions(this.url + "/log", { identity: identity })
    , function (error, response, body) {
        if (cb === undefined) { return }
        cb(error, body);
    });
};

module.exports = StatusDev;
