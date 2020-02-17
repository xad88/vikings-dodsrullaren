/**
 * XAD
 */

// Import the discord.js module
const Discord = require('discord.js');

// Create an instance of a Discord client
const client = new Discord.Client();

//load stuff...

//discord.js
const { Client, ClientUser } = require('discord.js');

/***

 SETTINGS
 --------
 
 ***/
//discord settings
let discord_login_token = '*TOken-api*';
let chat_command_prefix = '.';
//deathroll settings
let color_indexed_players = ["```bash\n", "```fix\n", "```\n"]; //```diff\n + (or) -
//deathroll messages
let initiated_player_message = ' the brave fucker just initiated a deathroll, just type "' + chat_command_prefix + 'deathroll -apply" to be part of that happening (if you got them balls :) )';
let signup_messages = '<--- This poor soul has accepted the challenge';
let already_signed_message = "you are already signed up... and there's no turing back";
let roll_introduceing_msg = [' did a good job and rolled: ', ' followed up with a hefty roll of: ', ' welll... you rolled: ', ' sorry for waiting but you rolled: ', ' i did my best rolling and you got: '];
let deathroll_channel = '';
//friday callout settings
let friday_callout_message = 'Nu är det fredag gubbar och damer! :D';
let friday_callout_channel = '';
//roll function
let error_not_numbers = 'Sori :(, only valid numbers plz';
let low_roll = 1; //standard
let high_roll = 100; //standard
let dice_count = 1; //standard
/*** 

 END SETTINGS
 ------------

***/

/*** GLOBAL VARS (no touch :P) ***/
//discord
let valt_commando;
let discord_error;
//roll function
let roll_output;
let min;
let max;
let dice_check;
let split_input;
//deathroll
let deathroll_init = false;
let deathroll_started = false;
let deathroll_array = [];
let deathroll_start_order = '';
let deathroll_current_roll;
let deathroll_last_roll; 
let deathroll_current_roll_index = 0;
let roll_introduceing_index = 0;
let first_roll; //first roll or not
let roll_number; //current roll in rollcycle
//friday callout
let date_get;
let curr_day;
let curr_hour;
let now_time;
let millisTill_friday;

/**
 * The ready event is vital, it means that only _after_ this will your bot start reacting to information
 * received from Discord
 */
client.on('ready', () => {
	console.log('Connected');
	console.log('Logged in as: ');
	console.log(client.user.username + ' - (' + client.user.id + ')');
	console.log('I am ready!');
	set_fridaycron();
	deathroll_clear_function();
	client.user.setActivity( chat_command_prefix + 'help', { type: 'LISTENING' })
	.then(presence => console.log('Activity message set!'))
	.catch(console.error);
});

/*** Error handling ***/
function error_throw_out(discord_error) {
	console.log(discord_error);
	message.channel.send('execution error... aborting');
}
/*** END Error handling ***/

/*** FRIDAY CALLOUT FUNCTIONS ***/
//friday check
function friday_check() {
	try {
	// start function
	date_get = new Date();
	curr_day = date_get.getDay();
	curr_hour = date_get.getHours();
	
	if(curr_day == '5' && curr_hour == '0') {
		console.log('Friday has come!');
		client.channels.get(friday_callout_channel).send('Nu är det fredag gubbar! :D');
	}
	
	console.log('Day -> ' + curr_day + ' Hour -> ' + curr_hour);
	set_fridaycron();
	//end function
	} catch(err) {
		error_throw_out("Function: friday_check -> " + err);
	}
}
//Daycrons
function set_fridaycron() {
	try {
	// start function
	now_time = new Date();
	millisTill_friday = new Date(now_time.getFullYear(), now_time.getMonth(), now_time.getDate(), 0, 0, 0, 0) - now_time;
	if (millisTill_friday < 0) {
		 millisTill_friday = millisTill_friday + 86400000; // it have passed, try tomorrow...
	}
	setTimeout(function(){ friday_check(); }, millisTill_friday);
	console.log('Daytimer set! :: MS left -> ' + millisTill_friday);
	//end function
	} catch(err) {
		error_throw_out("Function: set_fridaycron -> " + err);
	}
}
//END Timers
/*** END FRIDAY CALLOUT FUNCTIONS ***/

/*** ROLL FUNCTIONS ***/
function roll_function(low, high) {
	try {
	// start function
	roll_output = '';
	
	if(isNaN(low) == false && isNaN(high) == false) {
		min = Math.ceil(low);
		max = Math.floor(high);
		roll_output = Math.floor(Math.random() * (max - min + 1)) + min;
	} else {
		roll_output = error_not_numbers;
	}
	return roll_output;
	//end function
	} catch(err) {
		error_throw_out("Function: roll_function -> " + err);
	}
}

/*** send @message ***/
function user_to_send_to(tag_input_user, index_player, index_roll, content) {
	try {
	// start function
	array_split_tag_input_user = tag_input_user.split("#", 2);
	tag_input_user = array_split_tag_input_user[0];
	
	if(!index_player) {
		index_player = '';
	}
	
	if(!index_roll || index_roll < 0 || isNaN(index_roll) == true) {
		index_roll = -1;
		player_color = '```bash\n';
	}
	
	if(!content) {
		content = '';
	}
	
	if(index_roll >= 0) {
		modulated_index = index_roll % color_indexed_players.length;
		
		if(modulated_index > color_indexed_players.length) {
			player_color = '```\n';
		} else {
			player_color = color_indexed_players[modulated_index];
		}
	}
	
	return_thestring_user = player_color + index_player + '"' + tag_input_user + '"' + content + '\n```';
	return return_thestring_user;
	//end function
	} catch(err) {
		error_throw_out("Function: user_to_send_to -> " + err);
	}
}

/*** start order ***/
function start_check_loop(item, index) {
	try {
	// start function
	reindexed_startindex = index + 1;
	item = user_to_send_to(item, reindexed_startindex + '. ', index, '');
	deathroll_start_order = deathroll_start_order + '\n' + item;
	//end function
	} catch(err) {
		error_throw_out("Function: start_check_loop -> " + err);
	}
}

/*** start order noindex ***/
function start_check_loop_noindex(item, index) {
	try {
	// start function
	reindexed_startindex = index + 1;
	item = user_to_send_to(item, '', index);
	deathroll_start_order = deathroll_start_order + '\n*' + item + '*';
	//end function
	} catch(err) {
		error_throw_out("Function: start_check_loop_noindex -> " + err);
	}
}

/*** already started function ***/
function deathroll_already_started() {
	try {
	// start function
	deathroll_start_order = '';	
	deathroll_array.forEach(start_check_loop);
		
	message.reply('```It has already begun, the roll cycle is: \n' + deathroll_start_order + '(and then start over) \n```');
	//end function
	} catch(err) {
		error_throw_out("Function: deathroll_already_started -> " + err);
	}
}

/*** START FUNCTION shuffel ***/
function start_array_shuffle(array) {
	try {
	// start function
	currentIndex = array.length;
	temporaryValue = '';
	randomIndex = '';

	// While there remain elements to shuffle...
	while (currentIndex > 0) {

		// Pick a remaining element...
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		// And swap it with the current element.
		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
	//end function
	} catch(err) {
		error_throw_out("Function: do_deathroll_function -> " + err);
	}
}

/*** Clear deathroll ***/
function deathroll_clear_function() {
	try {
	// start function
	deathroll_init = false;
	deathroll_started = false;
	
	first_roll = true;
	
	deathroll_current_roll = 0;
	deathroll_current_roll_index = 0;
	roll_number = 1;
	//end function
	} catch(err) {
		error_throw_out("Function: deathroll_clear_function -> " + err);
	}
}

/*** Deathroll loop through ***/
function start_roll_death_loop() {
	try {
	// start function
	if(deathroll_current_roll != 0 && first_roll == true && deathroll_started == true) {
		//2nd contender run
		first_roll = false;
	}
	if(deathroll_current_roll == 0 && first_roll == true && deathroll_started == true) {
		//first roll
		item_roller = user_to_send_to(deathroll_array[deathroll_current_roll_index], 'Player: ', 0, ': ');
		
		deathroll_current_roll = roll_function(1, 1337);
		client.channels.get(deathroll_channel).send(item_roller);
		client.channels.get(deathroll_channel).send('started the rolling (1-1337) with a number of: ' + deathroll_current_roll);
	} 
	if(first_roll == false && deathroll_current_roll > 1 && deathroll_started == true) {
		//roll main
		item_roller = user_to_send_to(deathroll_array[deathroll_current_roll_index], 'Roll: ' + roll_number + ', Player: ', deathroll_current_roll_index, ': ');
		
		deathroll_last_roll = deathroll_current_roll;
		deathroll_current_roll = roll_function(1, deathroll_current_roll);
		roll_introduceing_index = roll_introduceing_msg.length;
		roll_introduceing_index = roll_function(0, roll_introduceing_index - 1);
		client.channels.get(deathroll_channel).send(item_roller + roll_introduceing_msg[roll_introduceing_index] + '__' + deathroll_current_roll + ' (1-' + deathroll_last_roll + ')__');
	}
	if(deathroll_current_roll == 1 && deathroll_started == true) {
		//loser crowned
		item_roller = deathroll_array[deathroll_current_roll_index];
		item_roller = item_roller.split("#", 2);
		item_roller = item_roller[0];
		//username saved to -> item_roller
		
		client.channels.get(deathroll_channel).send('```css\n [*** ' + item_roller + ' ***] omg you just rolled 1, bummer this means you lost the whole thing :( \n```');
		
		client.channels.get(deathroll_channel).send('Deathroll is done!');
		
		deathroll_clear_function(); //clear the whole thing
	}
	if(deathroll_started == true && deathroll_current_roll > 1) {
		deathroll_current_roll_index++;
		roll_number++;
	
		if(deathroll_current_roll_index > deathroll_array.length - 1) {
			deathroll_current_roll_index = 0;
			client.channels.get(deathroll_channel).send('No loser yet, starting over in 3 seconds...');
			
			deathroll_array.forEach((name, i) => {
			setTimeout(() => {
				start_roll_death_loop();
				}, (i * 3000));
			});
			//roller
		}
	}
	//end function
	} catch(err) {
		error_throw_out("Function: start_roll_death_loop -> " + err);
	}
}

/*** Deathroll main function ***/
function do_deathroll_function() {
	try {
	// start function
	// deathroll_current_roll == 0
	// first_roll == true
	// deathroll_started == true
	// deathroll_current_roll_index == 0
	
	deathroll_array.forEach((name, i) => {
	setTimeout(() => {
    start_roll_death_loop();
		}, (i * 3000));
	});
	
	//end function
	} catch(err) {
		error_throw_out("Function: do_deathroll_function -> " + err);
	}
}
/*** END ROLL FUNCTIONS ***/

// Create an event listener for messages
client.on('message', message => {
  
  valt_commando = message.content.split(" ");
  //Saves input to string array...

  // If the command is "help"
  if (valt_commando[0] === chat_command_prefix + 'help') {
	// try-catch
	try {
	// start command
    // Send help message to the same channel
    message.channel.send('```\nHello!, this bot responds with "' + chat_command_prefix + '" commands, Like this ' + chat_command_prefix + 'help you just used :)\n\n' 
	+ chat_command_prefix + 'ping                  = lets you know the ping for this bot...\n'
	+ chat_command_prefix + 'wut                   = sends a wut? ping to the channel that does the friday callouts\n'
	+ chat_command_prefix + 'chat                  = prints the link to discord text-formating\n'
	+ chat_command_prefix + 'channel_id            = Returns the specific id for current channel\n'
	+ chat_command_prefix + 'roll ["number of rolls"]x["min"]-["max"] = Returns a roll request for the current user, ex.\n' 
	+ '                                            "' + chat_command_prefix + 'roll 4x10-20" gives you 4 numbes between 10 and 20.\n'
	+ '                                            If no min or max is specified it gives you 4 numbers between 1 and 100\n'
	+ '```');
	message.channel.send('```\n' + chat_command_prefix + 'deathroll ["options"] = Start a deathroll\n'
	+ '           -apply      = Signup to the initiated deathroll\n'
	+ '           -start      = Start the deathroll (can only be done by the initiator)\n'
	+ '           -clear      = Resets the current deathroll (can be done by everyone, at any time)\n\n'
	+ 'Deathroll rules:\n'
	+ '----------------\n'
	+ '1. One player initiates a deathroll, only he/she can start the rolling\n'
	+ '2. Everyone can abort the deathroll by typing: ' + chat_command_prefix + "deathroll -clear\n"
	+ '3. Other players accepts the challenge by typing: ' + chat_command_prefix + "deathroll -apply (you cannot change your mind :P)\n"
	+ '4. The player who initiated the deathroll starts it by typing: ' + chat_command_prefix + "deathroll -start (good luck! :D)\n"
	+ '5. The startorder is randomly selected\n'
	+ '6. The rolling begins, the startorder is followed and restarted until someone gets a 1 in the rolling, this player lost the deathroll!\n'
	+ '```');
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "ping"
  if (valt_commando[0] === chat_command_prefix + 'ping') {
	// try-catch
	try {
	// start command
		// Send current ping of the bot to the same channel
		message.channel.send('My ping is ' + Math.round(client.ping) + 'ms');
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "roll"
  if (valt_commando[0] === chat_command_prefix + 'roll') {
	// try-catch
	try {
	// start command
    // Send roll request to the same channel
	
    low_roll = 1;
	high_roll = 100;
	dice_count = 1;
	
	split_input = "";
	
	//dices
	if(valt_commando[1]) {
		original_roll_input = valt_commando[1];
		split_input = valt_commando[1];
		dice_check = split_input.split("x", 2);
		dice_check_reversed = dice_check[0];
	}
	
	if(split_input.includes("x")) {
		//check if reversed dice string
		if(original_roll_input.startsWith("x") || dice_check_reversed.includes("-")) {
			reversed_input_roll = dice_check[0];
			reversed_input_dice = dice_check[1];
			dice_check[0] = reversed_input_dice;
			dice_check[1] = reversed_input_roll;
		}
		
		//dice roll
		if(dice_check[1]) {
			split_input = dice_check[1];
			splited_roll = split_input.split("-", 2);
			
			if(splited_roll[0] && splited_roll[1]) {
				low_roll = splited_roll[0];
				high_roll = splited_roll[1];
			} else if(splited_roll[0]) {
				high_roll = splited_roll[0];
			}
		}
		
		my_roll_number = roll_function(low_roll, high_roll);
		
		if(isNaN(dice_check[0]) == false) {
			loop_roll = '';
			i = 1;
			
			if(isNaN(my_roll_number) == false && isNaN(dice_check[0]) == false) {
				while (i < dice_check[0] && i < 10) {
					my_roll_number = roll_function(low_roll, high_roll);
					loop_roll = loop_roll + ', ' + my_roll_number;
					
					i++;
				}
			}
			
			my_roll_number = my_roll_number + loop_roll;
		}
		
		message.reply('rolled (' + low_roll + '-' + high_roll + '): **' + my_roll_number + '**');
		
		//end dice roll
		
	} else {
		//no dice roll
		if(valt_commando[1]) {
			split_input = valt_commando[1];
			splited_roll = split_input.split("-", 2);
			
			if(splited_roll[0] && splited_roll[1]) {
				low_roll = splited_roll[0];
				high_roll = splited_roll[1];
			} else if(splited_roll[0]) {
				high_roll = splited_roll[0];
			}
		}
		
		my_roll_number = roll_function(low_roll, high_roll);
		message.reply('rolled (' + low_roll + '-' + high_roll + '): **' + my_roll_number + '**');
	}
	//end dices
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "deathroll"
  if (valt_commando[0] === chat_command_prefix + 'deathroll') {
	// try-catch
	try {
	// start command
    // deathroll to the same channel
	if(deathroll_init == false && deathroll_started == false) {
		message.reply(initiated_player_message);
		
		deathroll_array = [];
		deathroll_init = true; //gets written over (bellow) by his/her username
		
		deathroll_init = message.author.tag;
		deathroll_array.push(deathroll_init);
		//initiated
	} else {
		
		//clear deathroll setup
		if(valt_commando[1] == '-clear') {
			deathroll_clear_function();
			
			message.channel.send('Deathroll cleard!');
		}
		//apply
		if(valt_commando[1] == '-apply') {
			have_apply = false;

			function array_check_loop(item, index) {
				if(message.author.tag == item) {
					have_apply = true;
				}
			}
			
			deathroll_array.forEach(array_check_loop);
			
			if(have_apply == true) {
				message.reply(already_signed_message);
			} else {
				deathroll_array.push(message.author.tag);
				message.reply(signup_messages);
				
				deathroll_start_order = "";
				deathroll_array.forEach(start_check_loop_noindex);
				
				message.channel.send('These have signed so far: \n' + deathroll_start_order + '');
			}
		}
		//start command
		if(valt_commando[1] == '-start') {
			//check if it started
			if(deathroll_started == false) {
				//only the initiator can start it...
				if(deathroll_init == message.author.tag) {
					//check if right user to start
						
						deathroll_array = start_array_shuffle(deathroll_array);
						
						deathroll_start_order = '';
						deathroll_array.forEach(start_check_loop);
						
						message.reply('started the the battle, to the death! \n\nThe roll order will be as follow: \n--------------------------------- \n' + deathroll_start_order + '\n\n(and then start over)');
						
						deathroll_started = true;
						deathroll_init = false;
						
						client.channels.get(deathroll_channel).send('Starting in 5 seconds, wait for it...');
						
						setTimeout(function(){ do_deathroll_function(); }, 5000);


					//end
				} else {
					//you can't start it, sry
					message.reply("you can't start it, only " + user_to_send_to(deathroll_init) + ' can...');
				}
				//end start
			} else {
				//already started
				deathroll_already_started();
				//END already started
			}
		}
		//no otion
		if(valt_commando[1] == '' || !valt_commando[1]) {
			if(deathroll_started == true) {
				deathroll_already_started();
			} 
			if(deathroll_init != false) {
				item = user_to_send_to(deathroll_init);
				message.channel.send(item + ' have already initiate a deathroll, signup by typing "' + chat_command_prefix + 'deathroll -apply"');
			}
		}
		//end no option
		
	}
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "channel_id"
  if (valt_commando[0] === chat_command_prefix + 'channel_id') {
	// try-catch
	try {
	// start command
    // Send channel id to the same channel
	message.channel.send('This channel has id: ' + message.channel.id);
  //end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "wut"
  if (valt_commando[0] === chat_command_prefix + 'wut') {
	// try-catch
	try {
	// start command
    // Send 'wut?' to the general channel
	client.channels.get(friday_callout_channel).send('wut?');
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  // If the command is "chat"
  if (valt_commando[0] === chat_command_prefix + 'chat') {
	// try-catch
	try {
	// start command
	message.channel.send('Use this link for discord text-formating: \n\nhttps://support.discordapp.com/hc/en-us/articles/210298617-Markdown-Text-101-Chat-Formatting-Bold-Italic-Underline-');
	message.channel.send('Also this link: \n\nhttps://www.writebots.com/discord-text-formatting/');
	//end command
	} catch(err) {
		error_throw_out(err);
	}
  }
  //END COMMANDS
});

// Log our bot in using the token
client.login(discord_login_token);