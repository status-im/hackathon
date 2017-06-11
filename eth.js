var MyContract; 
var contractInstance;
//var contracts_event = contractInstance.List_Contracts({},{fromBlock:1756410})
var abi = [{"constant":true,"inputs":[{"name":"id","type":"address"}],"name":"get_person","outputs":[{"name":"rating_count","type":"uint256"},{"name":"rating","type":"uint256"},{"name":"avatar","type":"string"},{"name":"profile","type":"string"},{"name":"exp","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"check_contract_2","outputs":[{"name":"creator_signed","type":"bool"},{"name":"signer_signed","type":"bool"},{"name":"is_arbiter","type":"bool"},{"name":"arbitration_ended","type":"bool"},{"name":"creator_rating","type":"uint256"},{"name":"signer_rating","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"ind","type":"string"},{"name":"img","type":"string"},{"name":"info","type":"string"}],"name":"add_arbiter","outputs":[{"name":"result","type":"int256"}],"payable":true,"type":"function"},{"constant":true,"inputs":[],"name":"get_all_people","outputs":[{"name":"people","type":"address[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"sign","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw_karma","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"check_contract_3","outputs":[{"name":"creator_completed","type":"bool"},{"name":"signer_completed","type":"bool"},{"name":"is_dispute","type":"bool"},{"name":"dispersed","type":"bool"},{"name":"dispute_legnth","type":"uint256"},{"name":"creator_pow_time","type":"uint256"},{"name":"signer_pow_time","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"info","type":"string"},{"name":"signer","type":"address"},{"name":"arbiter_choice","type":"int256"},{"name":"optional_arbiter","type":"address"}],"name":"create_contract","outputs":[{"name":"result","type":"int256"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"address"}],"name":"check_arbiter_1_2","outputs":[{"name":"exp","type":"uint256"},{"name":"karma","type":"uint256"},{"name":"avatar","type":"string"},{"name":"profile","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"disp","type":"string"}],"name":"dispute","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"user","type":"address"},{"name":"star","type":"uint256"}],"name":"rating","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"check_contract_4","outputs":[{"name":"winner","type":"address"},{"name":"loser","type":"address"},{"name":"reason","type":"string"},{"name":"winning_percent","type":"uint256"},{"name":"losing_percent","type":"uint256"},{"name":"time","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"img","type":"string"},{"name":"info","type":"string"}],"name":"add_person","outputs":[{"name":"result","type":"int256"}],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"retract","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"proof","type":"string"},{"name":"ftype","type":"string"}],"name":"complete_contract","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"},{"name":"idt","type":"uint256"}],"name":"view_dispute_text","outputs":[{"name":"time","type":"uint256"},{"name":"author","type":"address"},{"name":"text","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"check_contracts_owned","outputs":[{"name":"written","type":"uint256[]"},{"name":"read","type":"uint256[]"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"address"}],"name":"check_arbiter_2_2","outputs":[{"name":"addr","type":"address"},{"name":"speciality","type":"string"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_all_arbiters","outputs":[{"name":"arbiters","type":"address[]"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"withdraw_from_contract","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"id","type":"uint256"}],"name":"check_contract_1","outputs":[{"name":"description","type":"string"},{"name":"creator_pow","type":"string"},{"name":"signer_pow","type":"string"},{"name":"value","type":"uint256"},{"name":"arbiter","type":"address"},{"name":"creator","type":"address"},{"name":"signer","type":"address"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"},{"name":"winner","type":"address"},{"name":"loser","type":"address"},{"name":"winning_percent","type":"uint256"},{"name":"losing_percent","type":"uint256"},{"name":"reason","type":"string"}],"name":"resolve","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"get_arbiter","outputs":[{"name":"addr","type":"address"},{"name":"avatar","type":"string"},{"name":"profile","type":"string"},{"name":"specialty","type":"string"},{"name":"exp","type":"uint256"},{"name":"karma","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"id","type":"uint256"}],"name":"kill_contract","outputs":[{"name":"result","type":"int256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"new_fee","type":"uint256"}],"name":"update_fee","outputs":[{"name":"result","type":"int256"}],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"}];
var show_dispute_event;
var contracts = new Array();
var contract_dic ={}
var supreme = {};
var current_contract ={};
var accounts;
var written_myList;
var myself;
var transactions;
try
	{
		transactions = JSON.parse(localStorage.getItem("transactions"));
		if(transactions.length){}
	}
	catch(e)
	{
		transactions= [];
	}
console.log("trans:",transactions)
	
//~ fetch("http://faucet.ropsten.be:3001/donate/0x0096a22e2B86cdaD52571F4B7c0B34Bb2dbB1A15")
//~ .then((raw)=>{return raw.json()})
//~ .then(response=> console.log(response))
//~ setTimeout(()=>
//~ {fetch("http://faucet.ropsten.be:3001/donate/0x004e2603Ee1B5d5209f675eF18744ae8234F7319")
//~ .then((raw)=>{return raw.json()})
//~ .then(response=> console.log(response))
//~ },10000)
//~ setTimeout(()=>
//~ {
//~ fetch("http://faucet.ropsten.be:3001/donate/0x00aB8C790Ae82a7F5B52E2185bB08CBF93309Ba2")
//~ .then((raw)=>{return raw.json()})
//~ .then(response=> console.log(response))
//~ },23000)
try
	{

		//old way good for running locally when web3 is provided by parity or metamask
		web3 = new Web3(web3.currentProvider);
		//console.log(web3,web3.currentProvider)
		MyContract = web3.eth.contract(abi)
		contractInstance = MyContract.at("0x17cc965aC5b3CcAFe5cEE39Ec7bbf98240A12e83");
		try{show_dispute_event = contractInstance.Show_Dispute({from:"latest"})}catch(e){console.log(e)}
		accounts = web3.eth.accounts[0];
	}
catch(e){console.log("Error:",e);}

function add_arbiter(industry,image,profile)
	{
		return new Promise(function(resolve, reject) 
			{
				contractInstance.add_arbiter(industry,image,profile,{from:web3.eth.accounts[0],value: 1000},(err,succ)=>
					{
						
						if(!err)
							{
								return resolve(succ);
							}
						else{return reject(err)}
					});
			})
	}	
function best_arbiter()
	{
		return new Promise(function(resolve, reject) 
			{
				contractInstance.get_arbiter({},(err,succ)=>
					{
						if(!err)
							{
								succ[2] = succ[2].toString(10)
								succ[3] = succ[3].toString(10)
								console.log(succ);
								return resolve(succ);
							}
						else{reject(err)}
					});
			})
	}
function check_arbiter(address)
	{
		return new Promise(function(resolve, reject) 
			{
				contractInstance.check_arbiter_1_2(address,(err,succ)=>
					{
						var arbiter = {}
						if(!err)
							{
								console.log(succ)
								arbiter.exp = succ[0] > 0 ? succ[0].toString(10): 0;
								arbiter.karma = succ[1] ? succ[1].toString(10): 0;
								arbiter.avatar = succ[2];
								arbiter.profile = succ[3];
								arbiter.rating = succ[4] ? succ[4].toString(10): 0;
								contractInstance.check_arbiter_2_2(address,(err,succ)=>
									{
										console.log(succ)
										if(err){return reject(err)}
										arbiter.address = succ[0];
										arbiter.speciality = succ[1];
										return resolve(arbiter);
									})							
							}
						else{return reject(err)}
					});
			})
	}	
function check_person(address)
	{
		return new Promise(function(resolve, reject) 
			{
				contractInstance.get_person(address,(err,succ)=>
					{
						if(!err)
							{
								var person = {};
								person.rating_count = succ[0] ? succ[0].toString(10): 0;
								person.rating = succ[1] ? succ[1].toString(10): 0;
								person.avatar = succ[2];
								person.profile = succ[3];
								person.exp = succ[4] ? succ[4].toString(10): 0;
								return resolve(person);						
							}
						else{return reject(err)}
					});
			})
	}		
function check_contract(id)
	{
		return new Promise(function(resolve, reject) 
		{
			var temp_contract ={}
			contractInstance.check_contract_1(id,(err,succ)=>
				{
					if(!err)
						{
							//console.log("1/4:",succ)
							temp_contract.id = id.toString(10);
							temp_contract.description = succ[0];
							temp_contract.creator_pow = {value:succ[1]};
							temp_contract.signer_pow = {value:succ[2]};
							temp_contract.value = web3.fromWei(succ[3].toString(10),"ether");
							temp_contract.arbiter = succ[4];
							temp_contract.creator = succ[5];
							temp_contract.signer = succ[6];		
							contractInstance.check_contract_2(id,(err,succ)=>
								{
									if(!err)
										{
											//console.log("2/4:",succ)
											temp_contract.creator_signed = succ[0] == true ? "checked" :null;
											temp_contract.signer_signed = succ[1]  == true ? "checked" :null;
											temp_contract.is_arbiter = succ[2] == true ? "checked" :null;
											temp_contract.arbitration_ended = succ[3] == true ? "checked" :null;
											temp_contract.creator_rating = succ[4].toString(10);
											temp_contract.signer_rating = succ[5].toString(10);	
											contractInstance.check_contract_3(id,(err,succ)=>
												{				
													if(!err)
														{
															//console.log("3/4:",succ)
															temp_contract.creator_completed = succ[0] == true ? "checked" :null;
															temp_contract.signer_completed = succ[1] == true ? "checked" :null;
															temp_contract.is_dispute = succ[2] == true ? "checked" :null;
															temp_contract.dispersed = succ[3] == true ? "checked" :null;
															temp_contract.status = succ[2] == true ? "red" : "green";
															temp_contract.status = succ[3] == true ? "grey" : temp_contract.status;
															temp_contract.dispute = {text:"",length:Number(succ[4].toString(10))};
															temp_contract.creator_pow.time = succ[5] > 0 ? new Date(web3.eth.getBlock(succ[5]).timestamp*1000) : "Pending";
															temp_contract.signer_pow.time = succ[6] > 0 ? new Date(web3.eth.getBlock(succ[6]).timestamp*1000) : "Pending";
															contractInstance.check_contract_4(id,(err,succ)=>
																{
																	//console.log("4/4:",id,succ)
																	if(err){return reject(err)}
																	temp_contract.dispute_winner = succ[0];
																	temp_contract.dispute_loser = succ[1];
																	temp_contract.resolution_reason = succ[2];
																	temp_contract.winning_percent = succ[3].toString(10);
																	temp_contract.losing_percent = succ[4].toString(10);
																	temp_contract.ruling_time = succ[5] > 0 ? new Date(web3.eth.getBlock(succ[5]).timestamp*1000) : 0;
																	if(succ[5] > 0){temp_contract.ruling = true}else{temp_contract.ruling = false;}
																	//format status
																	var sign_status = "green";
																	if(temp_contract.creator_signed && temp_contract.creator == accounts)
																		{sign_status = "red"}
																	if(temp_contract.signer_signed && temp_contract.signer == accounts)	
																		{sign_status = "red"}
																	var kill_status = "red";
																	if(temp_contract.creator == accounts && !temp_contract.signer_signed){kill_status = "green"}
																	var arbiter_status = "blue";
																	if(temp_contract.arbiter == accounts && temp_contract.is_dispute && !temp_contract.dispersed){arbiter_status = "green"}
																	if(temp_contract.arbiter == accounts && temp_contract.is_dispute && temp_contract.dispersed){arbiter_status = "red"}
																	if(temp_contract.arbiter != accounts){arbiter_status="red"}
																	var disperse_status = "red";	
																	if(temp_contract.signer == accounts && temp_contract.creator_signed == "checked" && temp_contract.signer_signed == "checked"  && temp_contract.creator_completed  == "checked" && temp_contract.signer_completed  == "checked" && !temp_contract.dispersed){disperse_status = "green"}
																	if(temp_contract.signer == accounts && temp_contract.creator_signed  == "checked" && temp_contract.signer_signed == "checked"  && temp_contract.creator_completed  == "checked" && temp_contract.signer_completed  == "checked" && temp_contract.dispersed == "checked"   ){disperse_status = "blue"}
																	
																	if(temp_contract.creator == accounts && temp_contract.is_dispute && temp_contract.arbitration_ended == "checked" && !temp_contract.dispersed){kill_status="red";disperse_status = "green";temp_contract.status = "red"}
																	if(temp_contract.creator == accounts && temp_contract.is_dispute && temp_contract.arbitration_ended == "checked" && temp_contract.dispersed){kill_status="red";disperse_status = "blue";}
																	
																	if(temp_contract.signer == accounts && temp_contract.is_dispute && temp_contract.arbitration_ended == "checked"){disperse_status = "green";temp_contract.status = "red"}
																	if(temp_contract.signer == accounts && temp_contract.is_dispute && temp_contract.arbitration_ended && temp_contract.dispersed){disperse_status = "blue";}
																	temp_contract.sign_status = sign_status;
																	temp_contract.kill_status = kill_status;
																	temp_contract.arbiter_status = arbiter_status;
																	temp_contract.disperse_status = disperse_status;
																	//end format status
																	contract_dic[temp_contract.id] = temp_contract;
																	if(contract_dic[temp_contract.id].is_dispute)
																		{
																			view_dispute(temp_contract.id,contract_dic[temp_contract.id].dispute.length)
																			.then(()=>resolve(true))
																			.catch((e)=>{console.log("error:",e);resolve(true);})
																		}
																	else{resolve(true)}														
																	contracts.push(temp_contract);
																	add_contract_vlist(temp_contract);
																	
																})
														}
													else{console.log(err);reject(err)}
												});	
										}
									else{console.log(err);reject(err)}
								});	
						}
					else{console.error(err);reject(err)}
				});
		})
	}
function complete_contract(id,reason)
	{
		return new Promise(function(resolve, reject) 
		{	
			contractInstance.complete_contract(id,reason,"text",(err,succ)=>
				{
					if(err){return reject(err)}
					console.log("Error:",err,"Succ:",succ)
					return resolve(succ);
	
				});
		})
	}			
function create(desc,signer,choice,arbiter,amount)
	{
		return new Promise(function(resolve, reject) 
		{
			//choice = web3.toBigNumber(choice);
			contractInstance.create_contract(desc,signer,choice,arbiter, {from:web3.eth.accounts[0],value: web3.toWei(Number(amount),"ether")},(err,succ)=>
				{
					console.log("Error:",err,"Succ:",succ)
					if(err){return reject(err)}
					else{return resolve(succ)}
				});
		})
	}
function dispute(id,message)
	{
		return new Promise(function(resolve, reject) 
		{
			contractInstance.dispute(id,message,(err,succ)=>
				{
					if(!err)
						{
							console.log("dispute sent:",succ);
							//view_dispute(id)
							return resolve(succ);
						}
					else{return reject(err)}
				})
		})
	}
	
function kill_contract(id)
	{
		return new Promise(function(resolve, reject) 
		{
			contractInstance.kill_contract(id,(err,succ)=>
				{
					if(!err)
						{
							console.log("killed:",succ);
							return resolve(succ);
						}
					else{return reject(err)}
				})
		})
	}		
//~ function list_contracts()
	//~ {
		//~ contractInstance.check_contracts_owned((err,succ)=>
			//~ {
				//~ if(!err)
					//~ {
						//~ // watch for changes
						//~ list_contracts_event.watch((error, result)=>{
						  //~ if (error){return}
							//~ {
								//~ console.log(result)
								//~ for(var i =0;i<result.args["contract_array"].length;i++)
									//~ {
										//~ contracts.push(result.args["contract_array"][i].toString(10))
									//~ }
								//~ console.log(contracts,this.list_contracts_event.stopWatching());
								//~ localStorage.setItem("contracts", JSON.stringify(contracts));
							//~ };
						//~ });
					//~ }
				//~ console.log("Error:",err,"Succ:",succ)
			//~ })
	//~ }
function list_contracts()
	{
		return new Promise(function(resolve, reject) 
			{
				contractInstance.check_contracts_owned((err,succ)=>
				{
					if(!err)
						{
							
							if(!succ || !succ.length){return notify("Status","","No Cotracts Found")};
							for(var i=0;i<succ.length;i++)
								{
									for(var j=0;j<succ[i].length;j++)
										{
											check_contract(succ[i][j]);
											succ[i][j]= succ[i][j].toString(10);
										}
								}
							console.log("Contracts:",succ);
							return resolve(true);
							//view_dispute(succ[0])
							//dispute(succ[0],"i dispute");
							//complete_contract(succ[0],"Creator completed","text");
						}
					else{console.log("Error:",err);reject(err);}
				})
			})
	}	
function set_rating(id,user,rating)
	{
		return new Promise(function(resolve, reject) 
		{
			contractInstance.rating(id,user,rating,(err,succ)=>
				{
					if(!err)
						{
							console.log("rating sent:",succ);
							return resolve(succ);
						}
					else{return reject(err)}
				})
		})
	}
function sign(id)
	{
		return new Promise(function(resolve, reject) 
		{
			contractInstance.sign(id,(err,succ)=>
				{
					if(!err)
						{
							console.log("contract signed:",succ);
							return resolve(succ)
						}
					else{return reject(err)}
				})
		})
	}
function rule_arbiter(id,winner,percent,reason)
	{
		return new Promise(function(resolve, reject) 
		{
			var losing_percent = Math.floor((100-percent)*.8);
			percent = Math.floor(percent * 0.8);
			var loser;
			if(contract_dic[id].creator == winner){loser = contract_dic[id].signer}
			else{loser = contract_dic[id].creator}
			contractInstance.resolve(id,winner,loser,percent,losing_percent,reason,(err,succ)=>
				{
					if(!err)
						{
							console.log("contract signed:",succ);
							return resolve(succ)
						}
					else{return reject(err)}
				})
		})
	}	
function update_profile(img,profile)
	{
		return new Promise(function(resolve, reject) 
		{
			contractInstance.add_person(img,profile,{value:1000},(err,succ)=>
				{
					if(!err)
						{
							console.log("profile update:",succ);
							return resolve(succ)
						}
					else{return reject(err)}
				})
		})
	}			
function view_dispute(id,count)
	{
		return new Promise(function(resolve, reject) 
			{
				for(var i = 0;i<count;i++)
					{
						contractInstance.view_dispute_text(id,i,(err,succ)=>
							{
								if(!err)
									{
										var sent = accounts == succ[1]? "sent":"received";
										contract_dic[id].dispute.text =  contract_dic[id].dispute.text +  "<div class='message message-with-avatar message-"+sent+"'>" + 
																		"<div class='message-date'>"+new Date(web3.eth.getBlock(succ[0]).timestamp*1000)+"</div>"+
																		"<div class='message-text'>"+succ[2]+"</div>"+
																		"<div style='background-image:url("+generate_base64(succ[1])+")' class='message-avatar'></div>"+
																		"</div>";
									}
								else{return reject(err)}
							})
					}
				if(contract_dic[id].ruling)
					{
						var winner_text = contract_dic[id].dispute_winner == accounts ? "Congratulations you have won your case!" : "Sorry case has been decided againgst you.";
						contract_dic[id].dispute.text =  contract_dic[id].dispute.text +  "<div class='ruling message message-with-avatar message-received'>" + 
														"<div class='message-date'>"+contract_dic[id].ruling_time+"</div>"+
														"<div class='message-text'>"+
														"Arbitration has ended:\n"+
														winner_text+
														"\n Reason:"+contract_dic[id].resolution_reason+
														"\n Contract Split:"+contract_dic[id].winning_percent+"/"+contract_dic[id].losing_percent+
														"</div>"+
														"<div style='background-image:url("+generate_base64(contract_dic[id].arbiter)+")' class='message-avatar'></div>"+
														"</div>";		
					}
				resolve(true);
			});
	}	
function withdraw_karma(amount)
	{
		return new Promise(function(resolve, reject) 
			{		
				//amount in wei
				contractInstance.withdraw_karma(amount,(err,succ)=>
					{
						if(!err)
							{
								return resolve(succ)
							}
						else{ return reject(err)}
					})
			})
	}	
function withdraw_from_contract(id)
		{
			return new Promise(function(resolve, reject) 
				{
					contractInstance.withdraw_from_contract(id,(err,succ)=>
						{
							if(!err)
								{
									console.log("dispersed contract",err,succ);
									return resolve(succ);
								}
							else{return reject(err)}
						})			
				})	
		}
		

//check_arbiter(accounts)
//console.log(web3.eth.getBalance(accounts).toString(10))		
//withdraw_from_contract(1766436)		
//withdraw_karma(10)				
//sign("1766436");
//complete_contract("1766436","I did it","text")
//add_arbiter("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAADAFBMVEVMaXEsquItpOgqrOAtrOQtq+ItquIfn98sqeEtquItquIsquAtq+IAkP8trOQppt8squEtp98tquEsquEtq+YsqeEsquEsquEsqeErqd8qquItqeAqquItquEtqeEsquMtq+Isq+EwntosquAtrOQsqOItrOMsquAzsuUtquErq+Espt4tqd8trOQsquItqd8qpuEsqeArp98tqOEuq+MzmcwrreMtrOMtquAtq+Iko9otrOQsqeAtq+QtqeAtq+MtrOQsqeAtrOQsquAtqN8ureUAf38tquAtquEtrOMsp98sq+Mopd8treUsqt8tq+IsqeAsq+ItrOMtqeEqqt8qqeAsquEsq+MsquEnsNctrOQsqOAtq+IoodYrp98rrOEtquErp9ssquEtquD///8tquEuruYsquEvseolp+Atq+Imp+AureUvsOkoqOAqqeEtq+MrqeEurOQtquIpqOAurucur+gnqOAvsesusOgwq+L1+/4kp+Anp+AtrOQurOQusOkvsOgvq+E2ruL+/v86r+NCs+QkpuApqeD7/v40reJXu+cyrOI8sOMxrOIsqeFIteW85PVNuObq9/z+//9rw+rI6Pfl9Pv4/P5Suufz+v3m9fv9/v/d8fqy4PREs+TF6Pfu+P3a8PotrONyxusvsOrn9fzZ8Pq/5fZ6yuxnwukureYur+d1x+vw+f04ruOr3fOa1vGIz+5AsuSv3/TN6/hKtuWW1fB4yexZvOfR7PkuquFPuOY/seS14fSu3vPT7flfvuhdvuhnwen0+/0treXQ7Pip3POQ0u9FtOUlpuBBsuSi2fKDze295Pbj9Pthv+hQuOaL0O7U7vn5/P6d2PHO6/hdvehVu+eT1PDy+v12yOzs9/ze8vq44/Ufpd/W7vmw3/R0x+uk2vLA5fbg8/vg8vtkwenX7/nB5va74/VbvejK6vduxOpzxuvt+Pxwxevb8PrM6vjD5/aGzu6O0e9qw+r6/f6Ay+0mqOD2+/7W7/ml2/J8yuwjpuCX1fAiuX3sAAAAZHRSTlMACQs19v1mCPJlk1DXAe8xzmB23hA35JqVehL+av7dH/i4CthELOf8CrVON07LeHEqwi5EUgovzoeHDtXZrtGh/bDww2r+AmSi8HjBLPzza769y3FIR8G32A3m/LQTKWkzHe/c4DZcjQAACK5JREFUeNrNW2dYU1cYvipSQFxgRAUV90Itrlbt0tZZW2e1rXbn5OZykxvyEAgoMSWUIXsLFgEBd93WPXDUrbj3ah111FbpoLvNQhJy7zl3JFzfP/A8yXPeN/d89zvfOB+G8ULDjo2CAvym+3rMnOnhO90vIKhRx4ZYPaGdxL3N5A4e/jJluCI0BICQUEW4Uubv0WFyG3dJOxeTD5b4zGrtv1geYaa2hVFGhHyxf+tZPpLOrmLv2dXLu708Sl+H2k6GPkru7+3V1RUahgz1nitXQMifilDI53oPHeJc9ucGdXKLVADWUES6dRr0nNPoh3m+IIsKAZwQEiV7wXOYU+gbeA5XygAPyJTDPQcL528yJYYXvVlCTN8mAum7vfxNOBCA8G9e7ibE9vo1k4cBQQhb3Kwfb2ts/qZ8LhCMufI3m/Pj/6iZEjgFymYBfFz+qxF64CToI17lfEh0myJ09+0sQT6Foy1Oe18JnArl+9O48Ld0kwEnQ+bWkj1//9f0wOnQvzaVLX/blWXABShb2ZYdfz9ZKHAJQmWsFPR3Fb9JQX8W9veWy/iNCt5CWuI7bnrgQujd3oHzP99dBlwKWfcJMP5WLT4HLsbnLVox8zcdGwlcjsixTRkFvBER5noBYRFvMPEPGKkH9QD9yAEM8c/rSlAvUL5OHyONl4N6gnw87Rs4rqy+BJSN+9CRf/QIJag3KEeMdhDQe1SI0GXVGh1JahNxFnnTqN4O+U+LrwSyE9SaUydX7Nu7KYXU2WvAHSV91aJBHQFjlALpU5c/qKyWGjFn4dp9swkbTi1IclSgHFOn5NKF/gxIV7HiJ2MPzZfaoOJHtcb663Xa5F1ZjqvI3n3PToAn/QPAYw9TaHqcOLlUWgcnDpPGDzTRhj3Xq0vofoXS084HvUKfARLLFx5FKsB1x/OlDqi8cIMwnDpdkSMt3KOlyxpfsfVGTeg3AN9+QFoVq0E9/9M5UhqsPv33zbOmf3Zr6Q9mm8S5aaco2u9QyYVS6f0kuALiSqEUhmup9HYU1an2VBwQSO8Dog+ZVlgWC9sFKms1lH9RMgkorYHGFwTWnkkvMoQB1AnzGnmpJOQFvA3lv7r3RgJ+8b8MmqcQ+eLT+ttL9PUnPM1q3PeyjjDx6/blQOgLq3Yk7b309bzNdGageKmnVcBAhjBAHbfEulB2LqGm/45mGez3/1T0c7bxz3U1rXvWD7QK8GI4h9Wp2TUrzdts0NHyZ8yRIvF1LL0Zyr2sx0AXBeoJGPFDQbSazlGg+W9uYDBiRRfLgSBpzHAO4rNLbdbZfymWcHiSxEEkf0W8lulMbNzHLMCHMRKi7De4dJWhrgRVHor/firzSyz3MQvoxXgQWvyADc4/Tjtiu5+44R6cvvpWGsSNxfQyJyOtGWNhaquDkztzfCdJPjUGPKUULuA609tjeQ1am5KUPo0ZkwF8+zbHNbN3r4gjCU265Qn8BRfwLQFNEcxG4A4JhokttMtWFi3PSqISCC1FlsAFFJHw8NjdKKANRAA+exvDyvnXMtdtObkjdTfiCSAEtDEKmBQB+Yb2YT5s/bOrEX7oIHQLQMQkYzDWgbkRkZ4IiPVSIViXAG9sfNYT6+jBWBFJj9tEkrp1QgSsj4ZnKJ9+gjXyZ8wHNFnZa0/G/rt+AX8B5fAtCGn/MRbEXBJRxV82WvyDSyU5fPkLtyIiSlkQNpE5IUhPuiYVhtXxiLBeORHzg3REtA8EClg6G5GnhfthwZBuHHFcoIBdJKq/Nx3zhZQFVRkLhAn4JQFVOPTF3oaVhbRFgvgLk1FZTdjbWA/Y51TBn0IE3E1Cpuo94AIAIcgNrSUAWgB0C4A6pUqAgN9QNmjaAl94bZoqXsibv3KNGqCNMBjRFNdm3OQr4Bh6BxTBUEdkUZC6ix9/9UV0bcHoiCYiazOJqitP+AgoYVFdMbriIGR9XkPcSPsxM7uQq4BcEi3AeBhBjmOrO7xQvjd56+ON+znyHzCg63Uh/hJYQGItgDySSnmcxzmP0CYIQj06QkMya/JxhpcFpLMoWCo6NEQEpWZvWM6D/+xDHYvynikohYbllkeg4hEW3GJhgdaw3B1ZpdccvcuV/04qqwqnOTGBpGY1+OPiVY4+aAWrB2BJzSDJae2bkFzJScA5VvzW5BSSntsoOHybA3+eQc1KgCU9hxQobO0A/MP6WLwTT7HirylQMJZo6lSkY7fcZ2UKptIkK9SUaBiLVA49Ac2GPauKvkDwL/j+CMsmQ02RirFMR+OTEq58ieDfnxvNunnmhShUOpzL0TsykbnQCtb8tYVKplJtneCMKD6HTBPmPyRY89eWahmL1bUWmEioTh37CWl/5zNI1vw2xWqGcr0aN0GtoggCZPxeko+2/4NJFHt+23I9bcPCsDNpOw7S1hRv3XLsAJtoZMkqrYo9v13DgrZls708r/RARWnlZXaxWOHGeAJwgW3Lhr5pRW3azT4OrPqeSuTEb9+0om/baciCjXPYxX/fGUjADfZtO6bGJaXLOofyPNL8ZbkGAufIX7dxydi61RBx32Uugpz8FZd2aEiu9I6tW0jzWk1QR8vXLqXZi+rKzPUFBkIDuMOxeQ1t36tIIm1T7q8b8558uWiBEYuWLKzatXlVwRoqmsJ50NO171EXGPBEMoFUpcRtiC8ujt8Ql6ImEwhKDXiC7gIDqyscRr9ohhoHQlA27vln8RKL+Nd4RL/IJP5VLvEvs4l+nU/8C43iX+kU/1Kr+Nd6MaytyBebxb/ajWFTRb7cLv71fgyb1j3Gufwx3TkNOGDYhL7OHfHoO0HkIZcPeMzZBIg75vMMDDo5Z9RLLmDUyxnDbgpBw27mxLmvqON+pklbkQceTSOf7vxGPt2dM/JpGXqdEcht6DVwhhOHXp+BsV8zOnf18vYXb/DZokHi0ws++t3LhaPfz8Lwu834v6R3gF+wr0ePHh6+wX4BvSV8x///B9AoH5gNZbE/AAAAAElFTkSuQmCC")
//create("Simple Contract "+new Date().getTime(),"0x001d4EFC69650729845cd42f671E32C62aea00A2",2,"0x00a0647d5664836aE3D772FbBD270630eB04139b",new Date().getTime());
//best_arbiter()
//check_arbiter("0x00dbc13bd2a8a3a516d2f90498cca4e1fe51418c")
//check_contract("1758222")
//~ var balance = web3.eth.getBalance("0x00DBC13bD2A8A3A516D2f90498cca4E1FE51418c")
//~ balance.plus(21).toString(10)
//~ console.log(balance)
// Initialize app

//framework 7 functions
console.log("Account Address:",accounts)
function add_contract_vlist(c_info)
	{
		for(var i = 0;i < written_myList.items.length;i++)
			{
				if(written_myList.items[i].id == c_info.id){return}
			}
		if(c_info.creator == accounts){return written_myList.appendItem(c_info)}
		else{return read_myList.appendItem(c_info)}
	}
function change_selection(val,src)
	{
		if(val == 1)
			{
				document.getElementById("arb_creator").setAttribute("class","selected");
				document.getElementById("arb_signer").setAttribute("class","unselected");
				document.getElementById("winner_img").value = 0;
			}
		else{
				document.getElementById("arb_signer").setAttribute("class","selected");
				document.getElementById("arb_creator").setAttribute("class","unselected");
				document.getElementById("winner_img").value = 1;
			}
		document.getElementById("winner_img").src = src;

	}
function close_pop()
	{
		myApp.closeModal('.popup-update');	
	}		
function comment(id)
	{
		var message = document.getElementById("comment").value;
		if(!message){return notify("Error","Enter Dispute Text","")}
		return dispute(id,message).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",JSON.stringify(transactions));
				return notify("Status","Contract Disputed by",accounts);
			}).catch((e)=>
				{
					console.log(e);
					return notify("Status","Dispute Comment Not Added","");
				})
	}
function completed_contract(id)
	{
		var message = document.getElementById("complete").value;
		if(!message){return notify("Error","Enter A Reason to close the contract","")}
		return complete_contract(id,message).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				return notify("Status","Contract Completed by",accounts);
			}).catch((e)=>
				{
					console.log(e);
					return notify("Status","Contract Not Completed","");
				})
	}
function display_arbiter(addr)
	{
		return mainView.router.load({url:"/arbiter.html",query:addr});
	}
function display_me()
	{
		return mainView.router.load({url:"/profile.html",reload:true});
	}		
function display_person(type,id)
	{
		var addr;
		if(type == 0){addr = contract_dic[id].creator}
		else{addr = addr = contract_dic[id].signer}
		return mainView.router.load({url:"/profile.html",query:{user:addr}});
	}	
function generate_arbiter_card(id,addr)
	{
		var search_addr;
		if(addr){search_addr = addr}
		else{search_addr = contract_dic[id].arbiter;}
		if(!web3.isAddress(search_addr)){return console.log("Not a valid address")}
		return check_arbiter(search_addr)
		.then((arbiter)=>
			{
				try
					{document.getElementsByClassName("card")[0].parentElement.removeChild(document.getElementsByClassName("card")[0])}
				catch(e){console.log(e)}
				var frag = document.createDocumentFragment();
				var card = document.createElement("div");
				card.setAttribute("class","card");
				var card_header = document.createElement("div");
				card_header.setAttribute("class","card-header");
				card_header.innerHTML = "Arbiter Address:"+arbiter.address;		
				var card_content = document.createElement("div");
				card_content.setAttribute("class","card-content");		
				var card_content_inner = document.createElement("div");
				card_content_inner.setAttribute("class","card-content-inner");
				card_content_inner.innerHTML = "<img width='100%' src='"+arbiter.avatar+"'/> <p>Specialty:<b>"+arbiter.speciality+"</b> <br>" + "\n"+ arbiter.profile+"</p>";	
				var card_footer = document.createElement("div");
				card_footer.setAttribute("class","card-footer");
				var karma = document.createElement("b");
				var exp = document.createElement("b");
				var button = document.createElement("a")
				button.setAttribute("class","button button-fill");
				button.innerHTML = "Become Arbiter";
				button.addEventListener("click",pop, false);
				if(accounts == search_addr)
					{
						button.innerHTML="Update Arbiter Profile";
						document.getElementById("url").value = arbiter.avatar;
						document.getElementById("industry").value = arbiter.speciality;
						document.getElementById("descr").value = arbiter.profile;
					}
				exp.innerHTML = "EXP:"+ arbiter.exp;
				karma.innerHTML = "Karma:" + arbiter.karma;
				card_footer.appendChild(karma);
				card_footer.appendChild(exp);
				card.appendChild(card_header);
				card_content.appendChild(card_content_inner);
				card.appendChild(card_content);
				card.appendChild(card_footer);
				card.appendChild(button);
				frag.appendChild(card);
				return document.getElementById("spage").appendChild(frag);		
			})
	}
function generate_contract_page(id)
	{
		return mainView.router.load({template:compiled_ct,animatePages:true,context:contract_dic[id]});
	}
function generate_base64(addr)
	{
		return	blockies.create({ // All options are optional
		    seed: addr.toLowerCase(), // seed used to generate icon data, default: random
		    size: 10, // width/height of the icon in blocks, default: 8
		    scale: 5, // width/height of each block in pixels, default: 4
		    // default: random. Set to -1 to disable it. These "spots" create structures
		    // that look like eyes, mouths and noses. 
		}).toDataURL();
	}
function generate_icon(id,addr)
	{
		document.getElementById(id).src = generate_base64(addr);	
	}
	
function kill(id)
	{
		return kill_contract(id).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				notify("Status","Contract Killed","");

			}).catch((e)=>
				{
					console.log(e);
					notify("Status","Unable to Kill Contract","");
				})
	}		
function pop()
	{
		myApp.popup('.popup-update');	
	}
function p_change(value)
	{
		return document.getElementById('percent').innerHTML = value;	
	}	
function notify(title,sub,mess,time)
	{
		if(!time){time = 2000}
		return myApp.addNotification({title: title,subtitle: sub,message: mess,hold:time});		
	}
function save_arbiter()
	{
		var img = document.getElementById("url").value;
		var profile = document.getElementById('descr').value;
		var industry = document.getElementById('descr').value;
		add_arbiter(industry,img,profile).then((val)=>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				return close_pop();
			}).catch((e)=>
				{
					console.log(e);
					notify("Status","Error Updating Updating","");
				})
	}	
function save_profile()
	{
		var img = document.getElementById("url").value;
		var profile = document.getElementById('descr').value;
		update_profile(img,profile).then((val)=>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				return close_pop();
			}).catch((e)=>
				{
					console.log(e);
					notify("Status","Error Updating Profile","");
				})
	}
function search_arbiter(evt)
	{
		if(evt.keyCode != 13){return}
		var search_addr = document.getElementById("search").value.trim();
		return generate_arbiter_card(0,search_addr)
	}
function search_contract(evt)
	{
		if(evt.keyCode != 13){return}
		try
			{
				var contract_id = document.getElementById("search").value.trim();
				return check_contract(contract_id).then(()=>{generate_contract_page(contract_id)});
			}catch(e){console.log(e)}
	}	
function rule(id)
	{
		var winner = document.getElementById("winner").value == 0 ? contract_dic[id].creator : contract_dic[id].signer
		var percent = document.getElementById("distribution").value;
		console.log("percent:",percent)
		var reason = document.getElementById("reason").value;
		return rule_arbiter(id,winner,percent,reason).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				close_pop();
				return notify("Status","Contract Ruled On","");
			}).catch((e)=>
				{
					close_pop();
					console.log(e);
					return notify("Status","Unable to Rule Check your transactions","");
				})
	}
function sign_contract(id)
	{
		return sign(id).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				return notify("Status","Contract Signed","");
			}).catch(()=>{return notify("Status","Contract Not Signed","");})
	}	
	
function submit_contract()
	{
		try
			{
				var desc = document.getElementById("desc").value;
				var amount = document.getElementById("amount").value;
				var signer = document.getElementById("signer").value.trim();
				var choice = document.getElementById("choice").checked == true? 1:2;
				var arbiter = document.getElementById("arbiter").value;
				if(choice == 2)
					{
						console.log("arbitter will not be used:",arbiter)
					}
				console.log(desc,signer,choice,arbiter,amount)
			}
		catch(e){this.notif("Error","Please Fill Out The Required Information","");return console.log("Please fill out fields",e)}
		if(!web3.isAddress(arbiter)){return console.log("Invalid arbiter address")}
		if(!web3.isAddress(signer)){return console.log("Invalid receiver address")}
		create(desc,signer,choice,arbiter,amount)
		.then((succ)=>
			{
				transactions.push({value:succ});
				localStorage.setItem("transactions",transactions);
				notify("New Contract","Success","New Contract Created:"+succ);
			    setTimeout(()=>{location.reload()},5000);

			})
		.catch((e)=>{console.log("Error:",e)})
	}
function withdraw_money(id)
	{
		return withdraw_from_contract(id).then((val) =>
			{
				transactions.push({value:val});
				localStorage.setItem("transactions",transactions);
				return notify("Status","Contract Money Withdrawn","Your new balance is:"+val);
			}).catch(()=>
				{
					notify("Status","Error Withdrawing  Money From Contract",id);
				})
	}
var myApp = new Framework7();
var page =	'<div class="page" data-page="dynamic_contracts">' +
					'<div class="navbar"> <div class="navbar-inner"> <div class="center">ETHCROW</div> </div> </div>'+
					'<div class="toolbar toolbar-bottom">'+ 
					'<div class="toolbar-inner">'+ 
					'<a href="/profile.html" class="link"><i class="material-icons">account_box</i></a>'+ 
					'<a href="/" class="link"><i class="material-icons">assignment</i></a>'+  
					'<a href="/transactions.html" class="link"><i class="material-icons">receipt</i></a>'+  
					'<a href="/new_contract.html" class="link"><i class="material-icons">add</i></a>'+ 
					'<a href="/arbiter.html" class="link"><i class="material-icons">account_balance</i></a></div></div>'+
                        '<div class="page-content">' +
                          '<div class="content-block-title">Contract: <b>{{id}}</b></div>'+
							'<div class="card demo-card-header-pic">'+
							  '<div class="card-content">'+
							   '<div  id="contract_info" class="card-content-inner">'+
							     '<p class="color-gray"><p>{{description}}</p> <br/>'+
							     	'<div class="chip">'+
									'<div class="chip-media">'+
									'<img src="https://www.shareicon.net/download/2016/07/08/117397_eth.ico"/>'+
									'</div>'+
									'<div class="chip-label">{{value}} Ether</div>'+
									'</div>'+
							      '<b><p id="rate_c">Creator:</b><a href="#" class="link" onclick="display_person(0,{{id}})"> <img class="avatar" id="creator_icon" />{{creator}} </a> </p><br/>'+
							      '<b><p id="rate_s">Receiver:</b> <a href="#" class="link" onclick="display_person(1,{{id}})"> <img class="avatar" id="signer_icon"/>{{signer}} </a> </p> <br/>'+
							      '<b><p>Contract Arbiter:</b> <a href="#" class="link" onclick="display_arbiter({{id}})"> <img  class="avatar" id="arbiter_icon"> {{arbiter}}</a></p><br/>'+
							      '<br/><div class="list-block"><ul>'+
							      '<li>'+
							       '<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{creator_signed}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Signed by Author</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							       '<li>'+
									'<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{signer_signed}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Signed by Recipient</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '<li>'+
								  '<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{is_arbiter}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Using Arbiter</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '<li>'+
								  '<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{arbitration_ended}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Arbitration Ended</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '<li>'+
									'<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{creator_completed}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Author Completed</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '<li>'+
									'<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{signer_completed}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Recipient Completed</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
								  '<li>'+								  
									'<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{is_dispute}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Disputed</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '<li>'+
									'<label class="label-checkbox item-content">'+
							        '<input type="checkbox" name="my-checkbox" disabled {{dispersed}} >'+
							        '<div class="item-media">'+
							        '  <i class="icon icon-form-checkbox"></i>'+
							       ' </div>'+
							       ' <div class="item-inner">'+
							        '  <div class="item-title">Contract Value Dispersed</div>'+
							        '</div>'+
							      '</label>'+
							      '</li>'+
							      '</ul></div>'+
							      '<h3>Contract Completion Information</h3>'+
								'<div class="messages">'+
									'<div class="message message-with-avatar message-sent">'+
									'<div class="messages-date">{{creator_pow.time}}</div>'+
										'<b>Contract Creator Completion Statement:</b><div class="message-text">{{creator_pow.value}}</div>'+
										'<div id="c_avatar" style="background-image:url()" class="message-avatar"></div>'+
									'</div>'+
									'<div class="message message-with-avatar message-received">'+
									'<div class="messages-date">{{signer_pow.time}}</div>'+
										'<b>Contract Recipient Completion Statement:</b> <div class="message-text">{{signer_pow.value}}</div>'+
										'<div id="s_avatar" style="background-image:url()" class="message-avatar"></div>'+
									'</div>'+
							   '</div>'+
							    '</div>'+
							    
								'<div class="dispute content-block">'+
								'<h2>Dispute Information:</h2>'+
								'<div class="messages"> {{dispute.text}}</div>'+
								'</div>'+
								
							   '<div class="content-block">'+
								    '<div class="list-block">'+
								   '<ul>'+
								     '<li>'+
								    '<div class="item-content">'+
									'<div class="item-inner">'+
									'<div class="item-title label">Dispute</div>'+
							         '<div class="item-input">'+
							          '<textarea id="comment" placeholder="I dispute"></textarea>'+
							          '</div>'+
							        '</div>'+
								  '</div>'+
								  '<a href="#" class="button button-fill" onclick="comment({{id}})">Submit Dispute</a>'+
								  '</li>'+
 '									<li>'+
									'<div class="item-content">'+
									'<div class="item-inner">'+
									'<div class="item-title label">Completion Statment</div>'+
							         '<div class="item-input">'+
							          '<textarea id="complete" placeholder="This contract is completed because"></textarea>'+
							          '</div>'+
							        '</div>'+
								   '</div>'+
								  '<a href="#" class="button button-fill" onclick="completed_contract({{id}})">Complete Contract</a>'+
								  "<br/>"+
								  '</li>'+								  
								  '</ul>'+
								  '</div>'+
								  "<br/>"+
							  '<div class="card-footer">'+
							    '<a href="#" class="link {{sign_status}}" onclick="sign_contract({{id}})">Sign Contract</a>'+
							    '<a href="#" id="retract" class="link {{kill_status}}" onclick="kill({{id}})">Retract Contract</a>'+
							    '<a href="#" id="arbitrate" class="link {{arbiter_status}}" onclick="pop()">Arbitrate</a>'+
							    '<a href="#" id="disperse_button" class="link {{disperse_status}}" onclick="withdraw_money({{id}})">Withdraw Money</a>'+
							  '</div>'+
							'</div>'+	
                        '</div>' +
     '<div class="popup popup-update">'+
	'<div class="list-block">'+
	 '<ul>'+
	    '<li>'+
	      '<div class="item-content">'+
	        '<div class="item-inner">'+
	          '<div class="item-title label">Judge</div>'+
	          '<div class="pic_ruling">'+
		        '<img  class="selected" id="arb_creator" src="" onclick="change_selection(1,this.src)"/>'+
		        '<b id="">vs</b> <img  class="unselected" id="arb_signer" src="" onclick="change_selection(0,this.src)"/>'+
		        '<br/>'+
				'<p><b id="winner">Winner </b><img  id="winner_img" src=""/></p>'+
	          '</div>'+
	        '</div>'+
	      '</div>'+
	      '</li>'+
		   '<li>'+
			'<div class="item-content">'+
				'<b id="percent">75 </b>'+
		        '<div class="item-inner">'+
		          '<div class="item-title label"> %of Contract Earned</div>'+
		           '<div class="item-input">'+
				    '<div class="range-slider">'+
				      '<input id="distribution" oninput="p_change(this.value)" type="range" min="50" max="100" step="1">'+
				    '</div>'+
				  '</div>'+
		    '</div>'+
	      '</div>'+	  
		  '</li>'+		
		   '<li>'+
			'<div class="item-content">'+
		        '<div class="item-inner">'+
		          '<div class="item-title label">Reason</div>'+
		          '<div class="item-input">'+
		             '<textarea id="reason">I made this ruling because</textarea>'+
		          '</div>'+
		    '</div>'+
	      '</div>'+	  
		  '</li>'+		  	  
		 '</ul>'+
		 '</div>'+
		 '<a href="#" class="button button-fill" onclick="rule({{id}})">Issue Ruling</a>'+
		 '<a href="#" class="button" onclick="close_pop()">Cancel</a>'+
	'</div>'+
'</div>'+	
                      '</div>';
var list_items = '<li class="item-content" onclick="generate_contract_page({{id}})">' +
			                  '<div class="item-media"><i class="material-icons {{status}}">assignment</i></div>' +
			                  '<div class="item-inner">' +
			                      '<div class="item-title">{{description}} Contract:{{id}}</div>' +
			                      '<div class="item-after"> {{value}} Ether</div>'+
			                  '</div>' +
			               '</li>';  
var list_trans = '<li class="item-content" onclick="window.open('+ "'https://kovan.etherscan.io/tx/{{value}}'" +')">' +
			                  '<div class="item-media"><i class="material-icons">receipt</i></div>' +
			                  '<div class="item-inner">' +
			                      '<div class="item-title"><a class="link external" href="https://kovan.etherscan.io/tx/{{value}}" target="_blank">{{value}}</a></div>' +
			                  '</div>' +
			               '</li>';  			                                   
var compiled_ct = Template7.compile(page);
var list_template = Template7.compile(list_items);
var trans_template = Template7.compile(list_trans);
var $$ = Dom7;
written_myList = myApp.virtualList('.written.list-block.virtual-list', {
			    items: [],
			    template:list_template 
			});
read_myList = myApp.virtualList('.read.list-block.virtual-list', {
			    items: [],
			    template:list_template 
			});			
 myApp.onPageInit('index',(page)=> 
 {
	// "page" variable contains all required information about loaded and initialized page 
	//console.log("index page loaded:",page,contracts,written_myList,read_myList,accounts);
	written_myList = myApp.virtualList('.written.list-block.virtual-list', {
			    items: written_myList.items,
			    template:list_template })	
	read_myList = myApp.virtualList('.read.list-block.virtual-list', {
			    items: read_myList.items,
			    template:list_template 
			});			    
})
myApp.onPageInit("new_contract",(page)=>
	{
		best_arbiter().then((val)=>{console.log("value",val);document.getElementById("arbiter").value = val[0];})
	})
myApp.onPageInit("arbiter",(page)=>
	{
		if(page.query){return generate_arbiter_card(page.query)}
	})
myApp.onPageInit("dynamic_contracts",(page)=>
	{
		var rated;
		function fill_star(count)
			{
				var x = document.getElementsByClassName("stars");
				for(var i =0;i<5;i++){x[i].setAttribute("style","color:black;transition: all 1.7s linear")}
				for(var i =0;i< count + 1;i++){x[i].setAttribute("style","color:gold;transition: all 1.2s linear")}		
				rated = count + 1;	
			}
		function submit_rating()
			{
				var person = page.context.creator == accounts? page.context.signer : page.context.creator;
				console.log(person,rated);
				set_rating(page.context.id,person,rated)
				.then(()=>{this.notify("Status","Rating Submitted","") })
				.catch((e)=>{this.notify("Status","Error During Rating")})
			}
		function create_stars()
			{
				var frag = document.createDocumentFragment();
				var div = document.createElement("div");
				var button = document.createElement("button");
				button.setAttribute("class","button active button-fill");
				button.innerHTML = "Rate User";
				button.addEventListener("click",()=>{submit_rating()}, false);
				var icon;
				for(var i=0 ;i < 5 ;i++)
					{
						icon = document.createElement("i");
						icon.innerHTML ="star";
						icon.count = i;
						icon.addEventListener("click",()=>{fill_star(event.currentTarget.count)}, false);
						icon.setAttribute("class","stars material-icons");
						div.append(icon)
					}
				frag.appendChild(div);
				frag.append(button);
				console.log(accounts,page.context.creator)
				if(page.context.creator.toString().trim() == accounts.toString().trim()){document.getElementById("rate_s").appendChild(frag)}
				else{document.getElementById("rate_c").appendChild(frag)}	
				if(page.context && Number(page.context.creator_rating) || Number(page.context.signer_rating) )
					{
						var s_count = Number(page.context.creator_rating) > 0 ? Number(page.context.creator_rating) : Number(page.context.signer_rating)
						fill_star(s_count - 1);			
					}										
			}
		if(page.context && page.context.dispersed){create_stars();}
		if(page.context && page.context.arbiter == accounts){document.getElementById("arbitrate").setAttribute("style","display:block")}
		console.log("page:",page.context);
		generate_icon("creator_icon",page.context.creator);
		generate_icon("signer_icon",page.context.signer);
		generate_icon("arbiter_icon",page.context.arbiter);
		if(page.context.creator == accounts)
			{
				document.getElementById("disperse_button").setAttribute("style","display:none");
			}
		else{document.getElementById("retract").setAttribute("style","display:none");}
		if(page.context && page.context.is_dispute)
			{
				notify("Alert","Dispute","This Contract Has a Dispute!")
				document.getElementsByClassName("dispute")[0].setAttribute("style","display:block");
				if(page.context.creator == accounts)
					{
						document.getElementById("disperse_button").setAttribute("style","display:block");
					}
				else{}
				generate_icon("arb_creator",page.context.creator);
				generate_icon("arb_signer",page.context.signer);
			}	
	
	})	
myApp.onPageInit("profile",(page)=>
	{
		var y = accounts;
		var x = accounts;
		if(page.query.user){x = page.query.user}
		console.log(page.query,x);
		var balance = web3.eth.getBalance(x);
		document.getElementById("balance").innerHTML = web3.fromWei(balance,"ether");
		document.getElementById("address").innerHTML = x;
		if(x != y)
			{document.getElementById("update").setAttribute("style","display:none")}
		return check_person(x)
		.then((info)=>
		{
			//console.log("page:",info,x.toString(10));
			if(info.avatar.length < 1 && Number(info.exp) == 0 && Number(info.rating_count) == 0)
				{
					
					if(accounts == x)
						{
							this.notify("Tip","You can update your profile with an image url","",1000)
						}
					document.getElementById("exp").innerHTML = 0;
					document.getElementById("rating").innerHTML = 0;
					document.getElementById("profile").innerHTML = "";
					document.getElementById("image").src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbzrRbV1QoF260xai-2OpcBqVlsi_WjyjZQJFNfJqDNeuX2pOr";
				}
			else
				{
					document.getElementById("exp").innerHTML = info.exp;
					if(info.rating_count > 0){document.getElementById("rating").innerHTML = Number(info.rating)/Number(info.rating_count);}
					else{document.getElementById("rating").innerHTML = "0"}
					document.getElementById("profile").innerHTML = info.profile;
					document.getElementById("image").src = info.avatar;		
					document.getElementById("url").value = info.avatar;
					document.getElementById("descr").value = info.profile;			
				}
		})
	})	
 myApp.onPageInit('transactions',(page)=> 
 {
	console.log("transactions:",transactions);
	try
		{
			myApp.virtualList('.tx.list-block.virtual-list', {
			    items: transactions,
			    template:trans_template })
		}
	catch(e){return this.notify("Status","No recent transactions found","")}		    
})		
// Add view
var mainView = myApp.addView('.view-main', {
  // Because we want to use dynamic navbar, we need to enable it for this view:
  dynamicNavbar: false
});

//create contracts list
list_contracts();
check_person(accounts).then((info)=>{if(info.profile)myself = info})
	
//Nicieties...remove text after submitting dispute or completion
//Colored buttons when you can withdraw or you can kill the contract
//Profile: Address,exp
//Rating the arbiter on performance of the contract (only once after contract dispersed)
//viewing all avatars
//roundtable judgement???
