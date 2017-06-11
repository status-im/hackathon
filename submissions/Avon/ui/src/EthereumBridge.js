import Notifier from './Notifier';

var bridge = {};
var errorMessages = {};
errorMessages.web3Missing = "A web3.js library is necessary to connect to Ethereum network. Ensure you're using a browser that supports it."
errorMessages.connectionFail = "Unable to connect to an Ethereum node";
errorMessages.invalidBeneficiaryAddress = "Invalid beneficiary address";
errorMessages.invalidDefaultAddress = "Your default address is not available/valid";
errorMessages.missingContractData = "Missing contract data. Retrying";

bridge.createCommit = function(commitmentData)
{
    var that = this;
    return new Promise(function(resolve, reject)
    {
        if(!that.allGood(true))
        {
            reject("Connection failed");
            return;
        }

        if(!that.isAddress(commitmentData.beneficiary))
        {
            Notifier.notify(errorMessages.invalidBeneficiaryAddress);
            reject(errorMessages.invalidBeneficiaryAddress);
            return;
        }

        if(!that.isAddress(window.web3.eth.defaultAccount))
        {
            Notifier.notify(errorMessages.invalidDefaultAddress);
            reject(errorMessages.invalidDefaultAddress);
            return;
        }

        window.LetsGetShitDone1.Commit(
            commitmentData.goal,
            commitmentData.beneficiary,
            commitmentData.endTimestamp,
            {value: window.web3.toWei(commitmentData.amount), gas: 500000})
            .then(function(value){
                resolve(value);
            }).catch(function(e){reject(e)});
    });
}

bridge.resolve = function(commitmentId,resolved)
{
    var that = this;
    return new Promise(function(resolve, reject)
    {   
        if(!that.allGood(true))
        {
            reject("Connection failed");
            return;
        }

        //window.web3.eth.defaultAccount=window.web3.eth.accounts[0];
        
        if(!that.isAddress(window.web3.eth.defaultAccount))
        {
            Notifier.notify(errorMessages.invalidDefaultAddress);
            reject(errorMessages.invalidDefaultAddress);
            return;
        }

        window.LetsGetShitDone1.Resolve(
            commitmentId,
            resolved,
            {value: 0, gas: 500000}).then(function(value){
                 resolve(value);
        }).catch(function(e){reject(e)});
    });
}


bridge.getNumberOfCommitments = function ()
{
    var that = this;
    return new Promise(function(resolve, reject)
    {
        if(!that.allGood(true))
            reject("No connection");

        window.LetsGetShitDone1.GetNumberOfCommitments().then(function(value)
            {
                resolve(value.toNumber());
            });
    });
}

bridge.getAllCommitmentsData = function( numberOfCommitments) //TODO  duplicated code with GetCommitmentData
{
    var that = this
    return new Promise(function(resolve, reject)
    {
        var commitments = [];
        for(var i = 0; i <= numberOfCommitments; i++)
        {
            window.LetsGetShitDone1.GetCommitmentData(i).then(function(data)
                {
                    var commitment = {};
                    commitment.commitmentId = data[0];
                    commitment.goal = data[1];
                    commitment.beneficiary = data[2];
                    commitment.endTimestamp = data[3].toNumber();
                    commitment.amount = window.web3.fromWei(data[4]);
                    commitment.state = that.toState(data[5].toNumber());
                    
                    commitments.push(commitment);
                    if(numberOfCommitments === commitments.length)
                    {
                        resolve(commitments);
                    }
                });
        }
    });
}

bridge.getCommitmentData = function( commitmentId)
{
    var that = this
    return new Promise(function(resolve, reject)
    {
        window.LetsGetShitDone1.GetCommitmentData(commitmentId).then(function(data)
            {
                var commitment = {};
                commitment.commitmentId = data[0];
                commitment.goal = data[1];
                commitment.beneficiary = data[2];
                commitment.endTimestamp = data[3].toNumber();
                commitment.amount = window.web3.fromWei(data[4]);
                commitment.state = that.toState(data[5].toNumber());
                
                resolve(commitment);
            });  
    });
}

bridge.toState = function(int)
{
    if(int === 0)
        return "ongoing";
    else if( int === 1)
        return "succeeded";
    else if (int === 2)
        return "failed"
    else
        return null;
}

bridge.startWatch = function()
{
    if(!this.allGood(true))
        return;

    var filter = window.web3.eth.filter('latest');

    filter.watch(function(error, result)
    {
        var block = window.web3.eth.getBlock(result, true);
        console.log('block #' + block.number);
        console.dir(block.transactions);
    });
}

bridge.isWeb3Avaialable = function ()
{
    if(window.web3)
        return true;
    return false;
}

bridge.isConnectedToEtherumNode = function ()
{
    return window.web3.isConnected();
}

bridge.allGood = function (showWarnings)
{
    if(!this.isWeb3Avaialable())
    {
        if(showWarnings)
            Notifier.notify(errorMessages.web3Missing);
        return false;
    }
    else if (!this.isConnectedToEtherumNode())
    {
        /*if(!window.web3.currentProvider)
            this.switchProvider("http://localhost:8545");
        else
            this.switchProvider("http://localhost:8546");

        if (!this.isConnectedToEtherumNode())
        {
            if(showWarnings)
            Notifier.notify(errorMessages.connectionFail);
            return false;
        }*/
        if(showWarnings)
        {
            Notifier.notify("Unable to connect. "+window.web3.currentProvider);
            return false;
        }
            

        Notifier.notify("Successfully connected. "+window.web3.currentProvider);
    }

    return true;
}


bridge.onContractLoaded = function()
{
    return new Promise(function(resolve, reject)
    {
        var check = function ()
        {
            if(window.LetsGetShitDone1)
                resolve();
            
            else
                window.setTimeout (function(){check()}, 500);  
        }
        
        check();        
    });
}

bridge.getDefaultAddressBalance = function()
{
    window.web3.fromWei(window.web3.eth.getBalance(window.web3.eth.coinbase));
}

bridge.isAddress = function (address)
{
    return window.web3.isAddress(address);
}

bridge.GetDefaultAddress = function()
{
    return window.web3.eth.defaultAccount;
}

bridge.GetBalance = function(address)
{
    return window.web3.eth.getBalance(address);
}

bridge.switchProvider = function (provider)
{
    window.web3.setProvider(new window.web3.providers.HttpProvider(provider));
}

bridge.getProviderString = function (provider)
{
    if(!window.web3)
        return "No web3 object"

    return window.web3.currentProvider.toString();
}

export default bridge;