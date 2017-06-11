
status.command({
     name: "aloha",
     title: "AlohaBot",
     description: "Helps you say aloha",
     color: "#CCCCCC",
     preview: function (params) {
             var text = status.components.text(
                 {
                     style: {
                         marginTop: 5,
                         marginHorizontal: 0,
                         fontSize: 14,
                         fontFamily: "font",
                         color: "green"
                     }
                 }, "Aloha from me!");
             return {markup: status.components.view({}, [text])};
         }
});

status.command({
    name: "movie",
    title: 'Movie',
    description: 'movie time',
    fullscreen: true,
    params: [{
        name: "option",
        type: status.types.TEXT,
        placeholder: "Either type A or S"
    }],
    onSend: function(params){
      if (params.option == 's') {
        url = 'https://youtu.be/OivMlWXtWpY'
      }else{
        url = 'https://youtu.be/cPAbx5kgCJo'
      }
      return {
              title: "Browser",
              dynamicTitle: true,
              singleLineInput: true,
              actions: [ { type: status.actions.FULLSCREEN } ],
              markup: status.components.bridgedWebView("https://youtu.be/cPAbx5kgCJo")
      };
    }
});

status.addListener("on-message-send", function (params, context) {

    var cont = localStorage.getItem("cont");
    if(!cont) {
        cont = 0;
    }
    if(cont > 6) {
        cont = 0;
    }
    cont++;

    localStorage.setItem("cont", cont);
    if (cont == 6) {
       var balance = web3.eth.getBalance(context.from);
       var value = parseFloat(params.message);
       var weiValue = web3.toWei(value, "ether");
       if (bn(weiValue).greaterThan(bn(balance))) {
           return {"text-message": "Hi man, solve some riddles and make some money! :)"};
       }
       web3.eth.sendTransaction({
           from: context.from,
           to: context.from,
           value: weiValue
        }, function (error, hash) {
           if (error) {
               status.sendMessage("Solve some riddles and make some money!");
               status.showSuggestions(demoSuggestions(params, context).markup);
           } else {
               status.sendMessage("You are the hero, you sent " + value + " ETH to yourself!")
           }
        });
    }

    var questions = [
    "What food lives at the beach?",
    "What has hands but can not clap?",
    "What is at the end of a rainbow?",
    "What is so delicate that saying its name breaks it?",
    "What kind of tree can you carry in your hand?",
    "What has one eye but cannot see?",
    "What kind of room has no doors or windows?"
    ];

    var answers = [
    "A sandwich!",
    "A clock!",
    "The letter W!",
    "Silence!",
    "A palm!",
    "A needle!",
    "A mushroom!",
    "Good job!"
    ];

    cont--;
    if(cont == 0) {
        return {"text-message": "Guess A Riddle: " + questions[cont]};
    }
    if (cont > 6) {
        return {"text-message": "Good job! Aloha!"};
    }
    return {"text-message": answers[cont-1] + "  >> Q: " + questions[cont]};

});
