var app;

//Bind pressing the Enter key to the onEnter function
(function($) {
    $.fn.onEnter = function(func) {
        this.bind('keypress', function(e) {
            if (e.keyCode == 13) func.apply(this, [e]);    
        });               
        return this; 
     };
})(jQuery);

$(document).ready(init);

function init()
{
	$("#btnGuess").on("click", guessSubmit);
	$("#playerGuess").onEnter(guessSubmit);
	$("#btnAgain").on("click", initGame);
	$("#btnHint").on("click", getHint);
	app = {};
	initGame();
}


function initGame()
{
	app.numGuesses = 0;
	app.guesses = [];
	app.prevGuess = "";
	$("#playerGuess").val(null);
	$(".guess-list").empty();
	app.answer = Math.floor((Math.random() * 100) + 1);
	$("#btnGuess").removeClass("disabled");
	$(".guess-box").removeClass("success");
	$("#message").text("Ready to play? You have 5 guesses.");
}

function guessSubmit()
{
	var guess = $("#playerGuess").val();
	var valid = true;
	var temp; 
	var message;
	$("#playerGuess").val(null);

	if (/^\+?(0|[1-9]\d*)$/.test(guess)===false)
	{
		message = "You must guess a number.";
		valid = false;
	}
	else if(guess>100||guess<1)
	{
		message = "Guess a number betwee 1 and 100.";
		valid = false;
	}
	else if (app.guesses.indexOf(guess)!==-1)
	{
		message = "You already guessed that number.";
		valid = false;
	}
	else if (guess==app.answer)
	{
		$("#message").text("Hooray! You guessed right!");
		$(".guess-list").empty();
		addGuess(guess,"winner");
		$("#btnGuess").addClass("disabled");
		$(".guess-box").addClass("success");
		return;
	}
	else
	{
		var diff = Math.abs(app.answer-guess);
		var prevDiff = Math.abs(app.answer-app.prevGuess);
		var message = "";
		if (diff<=5)
		{
			temp = "hot";
			if (app.numGuesses===0)
				message = "You're burning up!";
			else if (diff<prevDiff)
				message = "You're burning up and you're closer than the last guess!";
			else if (diff>prevDiff)
				message = "You're burning up, but you were closer last time!";
			else
				message = "You're burning up and you're just as close as the last guess!"

		}
		else if (diff<=10)
		{
			temp = "warm";
			if (app.numGuesses===0)
				message = "It's getting hot in here!";
			else if (diff<prevDiff)
				message = "You're getting hot and if feels toastier than last guess!";
			else if (diff>prevDiff)
				message = "You're getting hot but you were closer last time!";
			else
				message = "You're getting hot and you're just as close as the last guess!"
		}
		else if (diff<=20)
		{
			temp = "cool";
			if (app.numGuesses===0)
				message = "You're pretty cool...in a bad way."
			else if (diff<prevDiff)
				message = "You're pretty cool...in a bad way. But it's better than the last guess.";
			else if (diff>prevDiff)
				message = "You're pretty cool...in a bad way. And getting cooler.";
			else
				message = "Your're pretty cool...in a bad way.  But it's the same temperature as the last guess.";
		}
		else
		{
			temp = "cold";
			if (app.numGuesses===0)
				message = "It's really cold in here!";
			else if (diff<prevDiff)
				message = "It's really cold in here, but you're less frigid than before.";
			else if (diff>prevDiff)
				message = "It's really cold in here and winter is coming!";
			else
				message = "It's really cold in here! But at least you're just as close as before.";
		}

		message += " " + higherLowerCheck(app.answer,guess);
	}

	if(valid)
	{
		app.numGuesses++;
		app.guesses.push(guess);
		app.prevGuess = guess;
		addGuess(guess,temp);
	}
		

	var guessesLeft = 5-app.numGuesses;
	if (guessesLeft<=0)
	{
		$("#message").text("Bummer, no more guesses left! The correct answer was " + app.answer);
		$("#btnGuess").addClass("disabled");
		//initGame();
	}
	else
	{
		$("#message").text(message + " You have " + guessesLeft + " guesses left to get it right.");
	}

}

function getHint()
{
	$("#message").text("The correct answer is " + app.answer);
}

function addGuess(num,temp)
{
	var liItem = $("<li class='" + temp + "'>" + num + "</li>").css("display","inline").hide().fadeIn(2000);
	$(".guess-list").append(liItem);
}

function higherLowerCheck(answer,guess)
{
	if(answer>guess)
		return "Try guessing higher.";
	else 
		return "Try guessing lower.";
}