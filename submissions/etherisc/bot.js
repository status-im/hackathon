var isDemoMode = true;

status.addListener("init",
 function (params, context) {
    return {"text-message": "Hi, this is Lisa from Etherisc. How may I help you?"};
});

status.command({
     name: "start",
     title: "Start app",
     description: "Helps you use Etherisc",
     color: "#0000ff",
     params: [{
              name: "greet",
              type: status.types.TEXT,
              suggestions: startSuggestions
             }]
 });

 /*status.command({
     name: "cancel",
     title: "Cancel",
     description: "Cancel the current operation",
     color: "#0000ff",
     params: [{
              name: "cancel",
              type: status.types.TEXT,
              suggestions: cancelSuggestions
             }]
 });

 status.command({
     name: "back",
     title: "Back",
     description: "Takes you back",
     color: "#0000ff",
     params: [{
              name: "back",
              type: status.types.TEXT,
              suggestions: backSuggestions
             }]
 });*/

function startSuggestions() {
    return suggestions([{text:"Apply for policy", val:"Apply for policy"}]);
}

/*function cancelSuggestions() {
    return suggestions(["Cancel"]);
}

function backSuggestions() {
    return suggestions(["Go Back"]);
}*/

var MESSAGE  = {
    APPLY  : "Apply for policy",
    YES  : "Yes",
    CANCEL : "Cancel",
    BACK   : "Go Back",
    DEPARTURE : "AMS",
    DESTINATION : "CDG",
    DEPART_DATE : "Tomorrow",
    FLIGHT : "14.50 KLM 1665",
    PREMIUM : "0.16 ETH",
    ACCEPT : "Accept"
};

status.addListener("on-message-send", function (params, context) {
    var result = {
            err: null,
            data: null,
            messages: []
        };
    var input = params.message;
    try {

        var message = "";
        var suggestions = false;
        if(input.substr(0,5) === '2017-'){
          input = 'date:'+input;
        }
        if(input.indexOf(':') !== -1){
          switch(input.split(':')[0]){
            case 'departure':
              localStorage.setItem('departure', input.split(':')[1]);
              input = MESSAGE.DEPARTURE;
            break;
            case 'flight':
              localStorage.setItem('flight', input.split(':')[1]);
              input = MESSAGE.SETPREMIUM;
            break;
            case 'destination':
              localStorage.setItem('destination', input.split(':')[1]);
              input = MESSAGE.DESTINATION;
            break;
            case 'date':
              localStorage.setItem('date', input.split(':')[1]);
              input = MESSAGE.DEPART_DATE;
            break;
          }

        }

        //console.log(input);

        switch(input) {
            case MESSAGE.APPLY: {
                message = "Please pick your departure airport";
                suggestions = airPortSuggestions(top100airports, 'departure');
                break;
            }
            case MESSAGE.DEPARTURE: {
                message = "Please pick your destination airport";
                suggestions = airPortSuggestions(top100airports, 'destination');
                break;
            }
            case MESSAGE.DESTINATION: {
                message = "When will the flight depart?";
                break;
            }
            case MESSAGE.DEPART_DATE: {
                message = "So you go from "+localStorage.getItem('departure')+" to "+localStorage.getItem('destination')+" on "+localStorage.getItem('date')+'\n Answer: Yes/No';
                break;
            }
            case MESSAGE.YES: {
                message = "You selected flight "+localStorage.getItem('flight')+" on "+localStorage.getItem('date')+". Please enter the desired premium." + ((isDemoMode) ? "\nDEMO: 0.16 ETH" : "");
                suggestions = sendWhisperMsg();
                break;
            }
            case MESSAGE.SETPREMIUM: {
              message = "You selected flight "+localStorage.getItem('flight')+" on "+localStorage.getItem('date')+". Please enter the desired premium." + ((isDemoMode) ? "\nDEMO: 0.16 ETH" : "");
              break;
            }
            case MESSAGE.PREMIUM: {
                message = "Depending on the delay, you'll get the following payouts: \n15 - 29 min  1.58 ETH\n30 - 44 min  2.37 ETH\n      45+ min  4.75 ETH\n  Cancelled  7.89 ETH. \n\nYou can alter the premium or apply for the policy now." + ((isDemoMode) ? "\nDEMO: Accept" : "");
                break;
            }
            case MESSAGE.ACCEPT: {
                message = "Congrats! You have successfully applied for a FlightDelay Policy. The Tx Hash is 0xdeadbeef...";
                break;
            }
            case MESSAGE.CANCEL:
                message = "You canceled the transaction. Hope to see you again soon!";
                break;
            case MESSAGE.BACK:
                message = "How can I help you?" + ((isDemoMode) ? "\nDEMO: Apply for policy" : "");
                break;
            default: {
                message = "Sorry, I'm not sure I understand.";
            }
        }
    } catch (e) {
        result.err = e;
    }


    if(suggestions){
      return suggestions;
    }else{
      result["text-message"] = message;
      return result;
    }

});

/** Suggestion helpers */

status.command({
     name: "2flights",
     title: "Get flights",
     description: "Get flights via whisper",
     color: "#0000ff",
     params: [{
              name: "flights1",
              type: status.types.TEXT,
              suggestions: sendWhisperMsg
             }]
 });

// some common vars
var topicGet = '0x61965e62';
var topicAnswer = '0xd38554c7';
var pubKey1 = '';
var pubKeyBot = '0x04a264869ebfbabc54c935dda956ed38bd0051500396887d7ce2e8c38e6dd11fd2619491ec61f0affe8fdf7e7b97e6320cadff2088ae3a2840b258b3ce00c1260e';

// Fill in the codes of the airports and a departure date YYYY-MM-DD
// AMS, CDG, 2017-08-09
var getFlightList = function(origin, destination, departure){

  var flightHash = web3.sha3(origin+'|'+destination+'|'+departure);
  var flightData = localStorage.getItem(flightHash);

  if(flightData !== null){
    return flightData;
  }else{
    web3.shh.newKeyPair(function(err, id){
      web3.shh.getPublicKey(id, function(err, pub){
        pubKey1 = pub;

          var filterAsync = web3.shh.subscribe({
            type: "asym",
            key: pubKey1,
            topics: [topicAnswer]
          });

          var messageSend = {
            type: "asym",
            key: pubKeyBot, //Public key of API
            sig: pubKey1,
            topic: topicGet, //Topic for getting flights
            powTarget: 20.01,
            powTime: 20,
            ttl: 20,
            payload: '{ "origin": "'+origin+'", "destination":"'+destination+'", "departure":"'+departure+'", "pubKey": "'+pubKey1+'" }'
          };

          //console.log(messageSend.payload);
          if (web3.shh.post(messageSend) === null){

            //console.log('Message sent');

            // Do some timeout magic
            var d = new Date();
            var s = d.getTime();
            var wait = 4000; //Wait 4 seconds for response
            var e = s+wait;
            for(i=0;i<1000000;i++){
              /*Halt script because of lack of timeout */
              d = new Date();
              if(d.getTime() > e){
                break;
              }
            }

            //Get message (API response)
            var messages = web3.shh.getFloatingMessages(filterAsync);

            if(messages.length){
              //console.log(web3.toAscii(messages[0].payload));
              //console.log('received api request');
              var apiResponse = getJsonFromPayload(messages[0].payload);
              localStorage.setItem(flightHash, apiResponse);
              return apiResponse;
              //cb(apiResponse);
            }else{
              return false; //console.log('Response took to long');
            }
          }else{
            return false; //console.log('Sending failed');
          }
      });
    });
  }
}

function sendWhisperMsg() {
    var result = {
      err: null,
      data: null,
      messages: []
    };

    var apiCallWhisper = getFlightList('AMS', 'CDG', '2017-06-11');
    //console.log('API: '+apiCallWhisper);

    var suggs = [];

    if(typeof(apiCallWhisper) === 'object' && apiCallWhisper.length > 0){
      for(i=0; i<apiCallWhisper.length; i++){
        var d = new Date(apiCallWhisper[i].departureTime);
        if(typeof(apiCallWhisper[i].flightId) !== 'undefined'){
          suggs[suggs.length] = {text: apiCallWhisper[i].flightId+' - '+d.getHours()+':'+d.getMinutes(), val: 'flight:'+apiCallWhisper[i].flightId};
        }
      }
    }

    //console.log(suggs);
    return suggestions(suggs);

}

var getJsonFromPayload = function(hexPayload){
  var asciiPayload = web3.toAscii(hexPayload);
  if(!isJson(asciiPayload)) return asciiPayload;
  return JSON.parse(asciiPayload);
}

var isJson = function (str) {
    try {
        return !!JSON.parse(str);
    } catch (e) {
        return false;
    }
};

function airPortSuggestions(strings, type) {
    var suggestions = strings.map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_VALUE, type+':'+entry.val])},
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry.text
                        )
                    ]
                )]
            )
        );
    });
    return suggestionsInScrollView(suggestions)
}

function suggestions(strings) {
    var suggestions = strings.map(function(entry) {
        return status.components.touchable(
            {onPress: status.components.dispatch([status.events.SET_VALUE, entry.val])},
            status.components.view(
                suggestionsContainerStyle,
                [status.components.view(
                    suggestionSubContainerStyle,
                    [
                        status.components.text(
                            {style: valueStyle},
                            entry.text
                        )
                    ]
                )]
            )
        );
    });
    return suggestionsInScrollView(suggestions)
}

function suggestionsInScrollView(suggestions) {
    // Let's wrap those buttons in a scrollView
    var view = status.components.scrollView(suggestionsContainerStyle(suggestions.count), suggestions);
    return {markup: view}
}

function suggestionsContainerStyle(suggestionsCount) {
    return {
        marginVertical: 1,
        marginHorizontal: 0,
        keyboardShouldPersistTaps: "always",
        height: Math.min(56, (56 * suggestionsCount)),
        backgroundColor: "white",
        borderRadius: 5,
        flexGrow: 1
    };
}
var suggestionSubContainerStyle = {
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#0000001f"
};

var valueStyle = {
    paddingTop: 9,
    fontSize: 18,
    fontFamily: "font",
    color: "#000000de"
};

var top100airports = [
{val: 'AKL', text: 'AKL - Auckland, New Zealand Auckland International Airport'},
{val: 'AMS', text: 'AMS - Amsterdam, Netherlands Schiphol'},
{val: 'ARN', text: 'ARN - Stockholm, Sweden Arlanda International'},
{val: 'ATH', text: 'ATH - Athens, Greece - Venizelos'},
{val: 'ATL', text: 'ATL - Atlanta, GA, USA Hartsfield International'},
{val: 'AYT', text: 'AYT - Antalya, Turkey Antalya'},
{val: 'BCN', text: 'BCN - Barcelona, Spain Barcelona'},
{val: 'BKK', text: 'BKK - Bangkok, Thailand Bangkok International Airport'},
{val: 'BNE', text: 'BNE - Brisbane, Queensland, Australia Brisbane International Airport'},
{val: 'BOG', text: 'BOG - Bogota, Colombia Eldorado'},
{val: 'BOM', text: 'BOM - Bombay, India - Mumbai'},
{val: 'BOS', text: 'BOS - Boston, MA, USA Logan International Airport'},
{val: 'BRU', text: 'BRU - Brussels, Belgium National'},
{val: 'BSB', text: 'BSB - Brasilia, Distrito Federal, Brazil International'},
{val: 'BWI', text: 'BWI - Baltimore, MD, USA BaltimoreWashington International'},
{val: 'CAN', text: 'CAN - Guangzhou, China - Baiyun'},
{val: 'CDG', text: 'CDG - Paris, France Charles De Gaulle'},
{val: 'CGH', text: 'CGH - Sao Paulo, Sao Paulo, Brazil Congonhas'},
{val: 'CGK', text: 'CGK - Jakarta, Indonesia Soekarno Hatta International'},
{val: 'CJU', text: 'CJU - Cheju, South Korea Cheju'},
{val: 'CLT', text: 'CLT - Charlotte, NC, USA Charlotte/Douglas Intl Airport'},
{val: 'CPH', text: 'CPH - Copenhagen, Denmark Copenhagen'},
{val: 'CTS', text: 'CTS - Sapporo, Japan Chitose'},
{val: 'CTU', text: 'CTU - Chengdu, China'},
{val: 'DCA', text: 'DCA - Washington, DC, USA Ronald Reagan National Airport'},
{val: 'DEL', text: 'DEL - Delhi, India - Indira Gandhi International Airport'},
{val: 'DEN', text: 'DEN - Denver, CO, USA Denver International'},
{val: 'DFW', text: 'DFW - Dallas/Ft Worth, TX, USA Dallas Ft Worth International'},
{val: 'DME', text: 'DME - Moscow, Russia - Domodedovo'},
{val: 'DOH', text: 'DOH - Doha, Qatar Doha'},
{val: 'DTW', text: 'DTW - Detroit, MI, USA Detroit-Wayne County Metropolitan Airport'},
{val: 'DUB', text: 'DUB - Dublin, Ireland Dublin'},
{val: 'DUS', text: 'DUS - Dusseldorf, Germany Dusseldorf'},
{val: 'DXB', text: 'DXB - Dubai, United Arab Emirates Dubai International Airport'},
{val: 'EWR', text: 'EWR - Newark, NJ, USA Newark International Airport'},
{val: 'FCO', text: 'FCO - Rome, Italy Leonardo Da Vinci/Fiumicino'},
{val: 'FLL', text: 'FLL - Fort Lauderdale, FL, USA Ft Lauderdale/Hollywood Intl Apt'},
{val: 'FRA', text: 'FRA - Frankfurt, Germany Frankfurt International'},
{val: 'FUK', text: 'FUK - Fukuoka, Japan Itazuke'},
{val: 'GIG', text: 'GIG - Rio De Janeiro, Rio De Janeiro, Brazil International Airport'},
{val: 'GMP', text: 'GMP - Seoul, Gimpo International Airport'},
{val: 'GRU', text: 'GRU - Sao Paulo, Sao Paulo, Brazil Guarulhos International'},
{val: 'HEL', text: 'HEL - Helsinki, Finland Helsinki'},
{val: 'HGH', text: 'HGH - Hangzhou, China'},
{val: 'HKG', text: 'HKG - Hong Kong, Hong Kong'},
{val: 'HND', text: 'HND - Tokyo (Ōta), Japan - Haneda (羽田空港) Tokyo International Airport (東京国際空港)'},
{val: 'IAD', text: 'IAD - Washington, DC, USA Dulles'},
{val: 'IAH', text: 'IAH - Houston, TX, USA'},
{val: 'ICN', text: 'ICN - Incheon [Seoul], South Korea - Incheon International Airport'},
{val: 'IST', text: 'IST - Istanbul, Turkey Ataturk'},
{val: 'JED', text: 'JED - Jeddah, Saudi Arabia Jeddah International'},
{val: 'JFK', text: 'JFK - New York, NY, USA John F Kennedy Intl Airport'},
{val: 'JNB', text: 'JNB - Johannesburg, South Africa - O R Tambo International Airport (formerly Jan Smuts)'},
{val: 'KMG', text: 'KMG - Kunming, China Kunming'},
{val: 'KUL', text: 'KUL - Kuala Lumpur, Malaysia - KLIA Kuala Lumpur International'},
{val: 'LAS', text: 'LAS - Las Vegas, NV, USA Mccarran International Airport'},
{val: 'LAX', text: 'LAX - Los Angeles, CA, USA Los Angeles Intl Airport'},
{val: 'LGA', text: 'LGA - New York, NY, USA Laguardia'},
{val: 'LGW', text: 'LGW - London, England, United Kingdom Gatwick'},
{val: 'LHR', text: 'LHR - London, England, United Kingdom Heathrow'},
{val: 'LIS', text: 'LIS - Lisbon, Portugal Lisboa'},
{val: 'MAD', text: 'MAD - Madrid, Spain Barajas'},
{val: 'MAN', text: 'MAN - Manchester, England, United Kingdom International'},
{val: 'MCO', text: 'MCO - Orlando, FL, USA Orlando International Airport'},
{val: 'MDW', text: 'MDW - Chicago, IL, USA - Midway'},
{val: 'MEL', text: 'MEL - Melbourne, Victoria, Australia - Tullamarine'},
{val: 'MEX', text: 'MEX - Mexico City, Distrito Federal, Mexico Juarez Intl Airport'},
{val: 'MIA', text: 'MIA - Miami, FL, USA Miami International Airport'},
{val: 'MNL', text: 'MNL - Manila, Philippines Ninoy Aquino International'},
{val: 'MSP', text: 'MSP - Minneapolis, MN, USA Minneapolis/St Paul Intl Airport'},
{val: 'MUC', text: 'MUC - Munich, Germany Franz Josef Strauss'},
{val: 'MXP', text: 'MXP - Milan, Italy Malpensa'},
{val: 'NRT', text: 'NRT - Tokyo, Japan - Narita'},
{val: 'ORD', text: 'ORD - Chicago, IL, USA - O\'hare International Airport'},
{val: 'ORY', text: 'ORY - Paris, France Orly'},
{val: 'OSL', text: 'OSL - Oslo, Norway'},
{val: 'PEK', text: 'PEK - Beijing, China Peking Capital Airport'},
{val: 'PHL', text: 'PHL - Philadelphia, PA, USA Philadelphia International Airport'},
{val: 'PHX', text: 'PHX - Phoenix, AZ, USA Sky Harbor International Airport'},
{val: 'PMI', text: 'PMI - Palma Mallorca, Mallorca Island, Spain Palma Mallorca'},
{val: 'PVG', text: 'PVG - Shanghai, China - Pudong Shanghai Airport'},
{val: 'RUH', text: 'RUH - Riyadh, Saudi Arabia King Khaled Intl'},
{val: 'SAN', text: 'SAN - San Diego, CA, USA Lindbergh International Airport'},
{val: 'SEA', text: 'SEA - Seattle, WA, USA Seattle Tacoma Intl Airport'},
{val: 'SFO', text: 'SFO - San Francisco, CA, USA San Francisco Intl Airport'},
{val: 'SHA', text: 'SHA - Shanghai, China - Shanghai Intl /Hongqiao/'},
{val: 'SIN', text: 'SIN - Singapore, Singapore Changi International Airport'},
{val: 'SLC', text: 'SLC - Salt Lake City, UT, USA Salt Lake City International Arpt'},
{val: 'STN', text: 'STN - London, England, United Kingdom Stansted'},
{val: 'SVO', text: 'SVO - Moscow, Russia - Sheremetyevo'},
{val: 'SYD', text: 'SYD - Sydney, New South Wales, Australia Sydney /KingsfordSmith/ Airport'},
{val: 'SZX', text: 'SZX - Shenzhen, China Shenzhen'},
{val: 'TPA', text: 'TPA - Tampa, FL, USA Tampa International'},
{val: 'TPE', text: 'TPE - Taipei, Taiwan - Taiwan Taoyuan International Airport (formerly Chiang Kai Shek Airport)'},
{val: 'TXL', text: 'TXL - Berlin, Germany Tegel'},
{val: 'VIE', text: 'VIE - Vienna, Austria Schwechat'},
{val: 'XMN', text: 'XMN - Xiamen, China - Xiamen International'},
{val: 'YVR', text: 'YVR - Vancouver, British Columbia, Canada Vancouver International'},
{val: 'YYZ', text: 'YYZ - Toronto, Ontario, Canada - Lester B Pearson International Airport'},
{val: 'ZRH', text: 'ZRH - Zurich, Switzerland Zurich'},
];
