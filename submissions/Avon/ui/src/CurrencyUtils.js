var x = {};

x.getEtherPrice = function()
{
    var target = 'https://coinmarketcap-nexuist.rhcloud.com/api/eth?callback=etherPriceCallaback';
    var script = document.createElement('script');
    script.src = target;
    document.getElementsByTagName('head')[0].appendChild(script);
}

window.etherPriceCallaback = function(json)
{
    console.log(json);
}

module.exports = x;



