var answer;
var numGuesses;
var guesses;
var prevGuess;

$(document).ready(init);

function init()
{
	$("#btnGuess").on("click", guessSubmit);
	$("#btnAgain").on("click", initGame);
	$("#btnHint").on("click", getHint);
	initGame();
}


function initGame()
{
	numGuesses = 0;
	guesses = [];
	prevGuess = "";
	$("#playerGuess").val(null);
	$(".guess-list").empty();
	answer = Math.floor((Math.random() * 100) + 1);
	$("#btnGuess").removeClass("disabled");
	$(".guess-box").removeClass("success");
	$("#message").text("Ready to play? You have 5 guesses.");
}

function guessSubmit()
{
	var guess = $("#playerGuess").val();
	var valid = true;
	var temp; 
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
	else if (guesses.indexOf(guess)!==-1)
	{
		message = "You already guessed that number.";
		valid = false;
	}
	else if (guess==answer)
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
		var diff = Math.abs(answer-guess);
		var prevDiff = Math.abs(answer-prevGuess);
		var message = "";
		if (diff<=5)
		{
			temp = "hot";
			if (numGuesses===0)
				message = "You're burning up!";
			else if (diff<prevDiff)
				message = "You're burning up and you're closer than the last guess!";
			else if (diff>prevDiff)
				message = "You're burning up, but you were closer last time!.";
			else
				message = "You're burning up and you're just as close as the last guess!"
		}
		else if (diff<=10)
		{
			temp = "warm";
			if (numGuesses===0)
				message = "It's getting hot in here!";
			else if (diff<prevDiff)
				message = "You're getting hot and if feels toastier than last guess!";
			else if (diff>prevDiff)
				message = "You're getting hot but you were closer last time!.";
			else
				message = "You're getting hot and you're just as close as the last guess!"
		}
		else if (diff<=20)
		{
			temp = "cool";
			if (numGuesses===0)
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
			if (numGuesses===0)
				message = "It's really cold in here!";
			else if (diff<prevDiff)
				message = "It's really cold in here, but you're less frigid than before.";
			else if (diff>prevDiff)
				message = "It's really cold in here and winter is coming!";
			else
				message = "It's really cold in here! But at least you're just as close as before.";
		}
	}

	if(valid)
	{
		numGuesses++;
		guesses.push(guess);
		prevGuess = guess;
		addGuess(guess,temp);
	}
		

	var guessesLeft = 5-numGuesses;
	if (guessesLeft<=0)
	{
		$("#message").text("Bummer, no more guesses left! The correct answer was " + answer);
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
	$("#message").text("The correct answer is " + answer);
}

function addGuess(num,temp)
{
	var liItem = $("<li class='" + temp + "'>" + num + "</li>").css("display","inline").hide().fadeIn(2000);
	$(".guess-list").append(liItem);
}