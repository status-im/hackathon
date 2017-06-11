//import React from 'react';

var notifier = {};

notifier.addListener = function (callback)
{
    this.notifyCallback = callback;
}

notifier.notify = function(message)
{
    this.notifyCallback(message);
}

notifier.addReloadListener = function (callback)
{
    this.reloadFeedCallback = callback;
}

notifier.reloadFeed = function (callback)
{
    this.reloadFeedCallback();
}


export default notifier;