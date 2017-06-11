function FeedService() {
    var service = this;
    
    var samplePair = {
	pairId: 1,
	title: "Versus (tap on image you like more)",
	imageSrcA: "http://i.imgur.com/7qPx5QWb.jpg",
	imageSrcB: "http://i.imgur.com/7qPx5QWb.jpg"
    };
    
    
    service._feed = [
//	samplePair
    ];
    
    service._rated = [];
    
    service.currentPairCounter = -1;

    
    service.feedSuggestionsView = function(params) {
	
	if (service.currentPairCounter > -1 && service._rated.length < service._feed.length) {
	    var pair = service._feed[service.currentPairCounter];
	    
	    var pairComponent = 
		    //
		    status.components.view(
			suggestionsContainerStyle,
			[
			    status.components.text(
				{style: titleStyle},
				pair.title 
			    ),		  
			    status.components.touchable(
				{onPress: status.components.dispatch([ status.events.SET_COMMAND_ARGUMENT, [0, "imageA"]])},
				status.components.image({style: imageStyle, source: {uri: pair.imageSrcA}})),
			    status.components.touchable(
				{onPress: status.components.dispatch([ status.events.SET_COMMAND_ARGUMENT, [0, "imageB"]])},
				status.components.image({style: imageStyle, source: {uri: pair.imageSrcB}}))
			]);
            
	} else {
	    var msg;
	    var title;
	    if (service.currentPairCounter < 0 ) {
		msg = "Please run /feedload command first to get pairs to rate";
		title = "Feed not loaded";
	    } else {
		title = "Nothing to rate";		
		msg = "Cool man,  you rated everything, now you can /claim your money";		
	    }
	    
	    var pairComponent = 
		    //
		    status.components.view(
			suggestionsContainerStyle,
			[
			    status.components.text(
				{style: titleStyle},
				title
			    ),
			    status.components.text(
				{style: valueStyle},
				msg
			    ),		  			    
			]);
	}
	
	var view = status.components.scrollView(
	    suggestionsContainerStyle(2),
	    [pairComponent]
	);
	
	
	// Give back the whole thing inside an object.
	return {markup: view};

    }


    service._buttonComponent = function(entry, dispatchLst) {
	return status.components.touchable(
	    {onPress: status.components.dispatch(dispatchLst)},
	    status.components.view(
		suggestionsContainerStyle,
		[status.components.view(
		    suggestionSubContainerStyle,
		    [
			status.components.text(
			    {style: valueStyle},
			    entry
			)
		    ]
		)]
	    )
	);
    };
    
    service.claimSuggestionsView = function(params) {
	
	if (service._rated.length > 0) {
	    
	    var title = "You have rated " + service._rated.length + " image pairs";
	    
	    
	    var pairComponent  = [
		status.components.view(
		    suggestionsContainerStyle,
		    [
			status.components.text(
			    {style: titleStyle},
			    title 
			),
			service._buttonComponent("Confirm", [ status.events.SET_COMMAND_ARGUMENT, [0, "confirm"]]),
			service._buttonComponent("Dismiss",[ status.events.SET_COMMAND_ARGUMENT, [0, "dismiss"]])
			
		    ])
	    ];	 
	} else {
	    var msg;
	    var title;
		msg = "You have not rated anything yet. Please /rate something first";
		title = "Nothing to claim";
	    
	    var pairComponent = [
		    //
		    status.components.view(
			suggestionsContainerStyle,
			[
			    status.components.text(
				{style: titleStyle},
				title
			    ),
			    status.components.text(
				{style: valueStyle},
				msg
			    ),		  			    
			])
	    ];
	};
	
	var view = status.components.scrollView(
	    suggestionsContainerStyle(2),
	    pairComponent
	);
	
	
	// Give back the whole thing inside an object.
	return {markup: view};

    }


    
    
    status.command({
	name: "rate",
	title: "Rate Versus",
	description: "Rate versus and earn eth",
	color: "#CCCCCC",
	fullscreen: true,
	params: [{
	    name: "image",
	    type: status.types.TEXT,
	    suggestions:service.feedSuggestionsView	
	}],
	handler: function (params) {
	    try {
		var pair = service._feed[service.currentPairCounter];
		var chosenLeftImage = -1;
		var rightParams = false;
		if (params.image === "imageA") {
		    chosenLeftImage = true;
		rightParams = true;
		} else if (params.image === "imageB") {
		    chosenLeftImage = false;
		    rightParams = true;
		}
		
		if (rightParams) {
		    service._rated.push([pair.pairId, chosenLeftImage]);
		    service.currentPairCounter += 1;
		    status.sendMessage("Good choice, man!\n\nPress '/rate' again to see the next pair.\n\n You have rated " + service._rated.length + " so far. To claim payout for your hard work run '/claim'.");
		    
		    
		}else   {
		    status.sendMessage("Oh, sorry! I didn't get which image you have rated. Please rate again!");
		    //status.sendMessage(params);
		}
		
		
	    } catch(error) {
		status.sendMessage("Oh no! I don't feel good today. Something wrong happened. Here is the error: ");
		status.sendMessage(error);
	    }
	}});
    
    
    
    status.command({
	name: "loadfeed",
	title: "Load Feed",
	description: "Load feed",
	color: "#CCCCCC",
	fullscreen: true,
	handler: function (params) {	
	    status.sendMessage("Wait a bit, I'm loading data from blockchain..." );
	    versusService.getVersuses(function(err, data) {
		service._feed = [];
		service._rated = [];
		service.currentPairCounter = 0;
		if (err) {
		    status.sendMessage("Oh no! Error occured while getting data from blockchain..." );
		} else {
		    status.sendMessage("Ok, we got feed for you. You have " + data.length + " unrated pairs of images.\n\nPress '/rate' to see the first pair." );
		    _.map(data, function(pair) {
			service._feed.push(pair);
		    });
    
		}
	    });
	    
	}
	
    });


    status.command({
	name: "claim",
	title: "Claim Payout",
	description: "Get you hard-earned money",
	color: "#CCCCCC",
	fullscreen: true,
	params: [{
	    name: "action",
	    type: status.types.TEXT,
	    suggestions:service.claimSuggestionsView	
	}],	
	handler: function (params, context) {
	    if (params.action === "dismiss") {
		status.sendMessage("Ok, no worries, man! Take you time.");
	    } else {
		status.sendMessage("Ok, submitting your polls to blockchain...");
		var ids = service._rated.map(function(d) { return d[0] });
		var bools = service._rated.map(function(d) { return d[1] });
		versusService.submitPolls(context.from, ids, bools, function(err, hash) {
		    if (err) {
			status.sendMessage("Oh no, there is an error!");
			status.sendMessage(err);
		    }else {
			service.currentPairCounter = -1;
			service._feed = [];
			service._rated = [];
			status.sendMessage("Successfully submitted you transaction. Here is the hash " + hash);
		    }
		});
		
	    }
	}
	
    });
    

}
//
var feedService = FeedService();
