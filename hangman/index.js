var bodyParts, word, correct, characters;
var wins = 0;
var losses = 0;

function key(event) {
	var letter = String.fromCharCode(event.which).toUpperCase();
	if (!(event.which >= 65 && event.which <= 90)) {
		return;
	}
	if ($('.guess' + letter).css('visibility') == 'hidden') {
		return;
	}
	if (event.altKey || event.ctrlKey || event.metaKey) {
		return;
	}
	guessLetter(letter);
}

function setWord(chosenWord) {
	word = chosenWord;
	for (var character in word) {
		if (word[character].charCodeAt(0) >= 65 && word[character].charCodeAt(0) <= 90) {
			$('<span></span>')
				.addClass('blank blank' + word[character])
				.html('_')
				.appendTo('#word');
				characters++;
		} else {
			$('<span></span>')
				.addClass('blank')
				.html(word[character])
				.appendTo('#word');
		}
	}
	$(document).keyup(key);
}

function selectWord(words) {
	setWord(words[Math.floor(Math.random() * words.length)].toUpperCase());
}

function getWords() {
	var request = new XMLHttpRequest();
	request.open('GET', 'words');
	request.onreadystatechange = function() {
		if(this.readyState == 4 && this.status == 200) {
			selectWord(this.responseText.split('\n'));
		}
	};
	request.send();
}

function lose() {
	$('#word').children().each(function(i) {
		$(this).html(word[i]);
	});
	losses++;
	if (confirm('You lose! Do you want to play again?')) {
		restart();
	}
}

function wrongGuess() {
	$('#' + bodyParts.pop()).css('visibility', 'visible');
	//$('#' + bodyParts.pop()).fadeTo(200, 1);
	if (bodyParts.length == 0) {
		lose();
	}
}

function updateWins() {
	$('#wins').html(wins);
	$('#losses').html(losses);
}

function win() {
	wins++;
	updateWins();
	if (confirm('You won! Do you want to play again?')) {
		restart();
	}
}

function guessLetter(letter) {
	var blanks = $('.blank' + letter);
	$('.guess' + letter).css('visibility', 'hidden');
	if (blanks.length == 0) {
		wrongGuess();
	} else {
		blanks.each(function() {
			$(this).html(letter);
			correct++;
		});
	}
	//$('.guess' + letter).fadeTo(200, 0);
	if (characters == correct && correct != 0) {
		win();
	}
}

function createLetter(letter) {
	$('<button></button>')
		.attr('type', 'button')
		.addClass('btn btn-default guess guess' + letter)
		.html(letter)
		.click(function() { guessLetter($(this).html().toUpperCase()); })
		.appendTo('#guesses');
}

function generateLetters() {
	for (var n = 0; n < 13; n++) {
		createLetter(String.fromCharCode(65 + n).toUpperCase());
	}
	$('#guesses').append($('<br/>'));
	for (var n = 13; n < 26; n++) {
		createLetter(String.fromCharCode(65 + n).toUpperCase());
	}
}

function restart() {
	$(document).unbind('keyup', key);
	bodyParts = ['leftLeg', 'rightLeg', 'leftArm', 'rightArm', 'body', 'head'];
	word = '';
	correct = 0;
	characters = 0;
	$('#word').empty();
	$('#guesses').empty();
	$('.bodyPart').css('visibility', 'hidden');
	getWords();
	generateLetters();
	updateWins();
	$('.guess').css('visibility', 'visible');
}

$(restart);
