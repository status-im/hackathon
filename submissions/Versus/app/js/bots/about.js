status.command({
     name: "about",
     title: "About",
     description: "About",
     color: "#CCCCCC",
     preview: function (params) {
             var text = status.components.text(
                 {
                     style: {
                         marginTop: 5,
                         marginHorizontal: 0,
                         fontSize: 14,
                         fontFamily: "font",
                         color: "black"
                     }
                 }, "The purpose of this app is to help people decide which one among two things is better. And let others earn ethereum tokens by making those decisions.\n\nUser can create a versus (poll) by uploading two pictures. Every new versus creates a blockchain transaction, therefore user needs to pay a fee, which depends on the amount of people he or she wants to participate in the poll. After a versus is submitted other users are able to participate in the poll.\n\nWhen a user makes decision on one or more versuses he or she can submit them in order to create a transaction and save them to the blockchain. Every time a user submits several decisions a fee is paid.\n\nAfter a submission user receives a refund which depends on the amount of decisions he or she has made. A refund amount may be greater than transaction so user can earn tokens from that.");

             return {markup: status.components.view({}, [text])};
         }
 });
