/*
 * Create a list that holds all of your cards
 */

let cards = [];
let symbols = ['fas fa-crow',
	'fas fa-crow',
	'fas fa-dove',
	'fas fa-dove',
	'fas fa-bolt',
	'fas fa-bolt',
	'fas fa-feather',
	'fas fa-feather',
	'fas fa-leaf',
	'fas fa-leaf',
	'fas fa-fish',
	'fas fa-fish',
	'fas fa-frog',
	'fas fa-frog',
	'fas fa-kiwi-bird',
	'fas fa-kiwi-bird'];
let openCards = [];
let matchedCards = [];
let targetCard;
let seconds = 0;
let minutes = 0;
let hours = 0;
let star = '3 stars';

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/*
1. Behaviour: Goes through the card deck, finds each symbol and replaces them with those listed in the 'symbols' array.
These are added to the cards array to create a new deck. Shuffle function above then shuffles the cards in the 'symbols' array (function called at end of document).
2. Inputs: Each card's current symbol. 'Symbols' array. Symbol index.
3. Outputs: 'Cards' array.
*/
let symbolIndex = 0;
function createCard() {
	$('.deck').find('i').each(function (){
		$(this).removeClass();
		$(this).addClass(symbols[symbolIndex]);
		cards.push($(this));
		symbolIndex++;
	});
}

/*
1. Behaviour: Event listener which listens for a click on the card and toggles the class to show the other side of the card.
Adds target card to array of open cards. If two cards are open, the click is disabled and the cards are compared to see if the symbols match.
2. Inputs: targetCard, cardCount, moveCount
3. Outputs: Calls toggleCard function to flip card. Calls compareCards to see if cards are a match. Calls disableClick to prevent flipping 
of more than two cards at one time. Calls endGame if all cards are matched.
*/
function toggleCard() {
	targetCard.toggleClass('open show');
}

let cardCount = 0;
let moveCount = 0;
function playGame() {
	$('.deck').on('click', '.card', function(){
		targetCard = $(this);
		moveCount++;
		moveCounter();
		if (cardCount < 2 && !targetCard.hasClass('open show')) {
			cardCount ++;
			toggleCard();
			openCards.push(targetCard);
			if (cardCount % 2 === 0) {
				disableClick();
				compareCards();
			}
		}
	});
	if (matchedCards.length === 16) {
		stopTimer();
		popUpModal();
	}
}

//Takes the number of moves that the player has taken and displays them on the page.
function moveCounter() {
	$('.moves').text(moveCount + " Moves");
	starRating();
}

//Turns off click event listener on cards.
function disableClick() {
	$('.deck').off('click', '.card');
}

//Removes all cards from the openCards array.
function resetOpenCards() {
	openCards.length = 0;
	playGame();
}

//Adds cards with the class 'match' to the matchedCards array.
function match() {
	openCards[0].addClass('match');
	openCards[1].addClass('match');
	matchedCards.push(openCards[0], openCards[1]);
}

//Turns the cards back over if they do not match.
function noMatch() {
	setTimeout(function() {
		openCards[0].toggleClass('open show');
		openCards[1].toggleClass('open show');
	}, 1000)
		setTimeout(resetOpenCards, 1000);
}

//Determines whether or not two cards are a match and resets the cardCount.
function compareCards() {
	if (openCards[0][0].firstElementChild.className === openCards[1][0].firstElementChild.className) {
		match();
		setTimeout(resetOpenCards, 1000);
		cardCount = 0;
	} else {
		noMatch();
		cardCount = 0;
	}
}

//Times how long the player is taking to complete the game.
/*
1. Behaviour: Initiates timer which is displayed at the top of the gameboard.
2. Inputs: seconds, minutes, hours
3. Outputs: 'time' which is displayed at the top of the board.
*/
let timer;
function startTimer() {
	timer = setInterval(function(){
		time = $('.timer').text(hours + " hours " + minutes + " minutes " + seconds + " seconds");
		seconds++;
		if (seconds === 60) {
			minutes++;
			seconds = 0;
		}
		if (minutes === 60) {
			hours ++;
			minutes = 0;
			seconds = 0;
		}
	}, 1000);
}

//Stops the timer.
function stopTimer() {
	clearInterval(timer);
}

//Enables visibility of Congratulations window and allows user to click on the 'x' to close the window.
/*
1. Behaviour: Makes modal visible. Creates congratulations message with score. Allows user to click on the 'x'
to close the window.
2. Inputs: None
3. Outputs: Congratulations message, score (number of stars, time to complete).
*/
function popUpModal(){
	$('.modal').css('display', 'block');
	$('#congrats-text').text('Congratulations! You have completed the game in ' + time.html() + ' with ' + star + '.' + ' Click on the button to play again.');
	$('.modal-content').on('click', 'span', function () {
		$('.modal').css('display', 'none');
	});
}

//Refreshes the page to restart the game when the replay button is clicked.
function restartGame() {
	$('.container').on('click', ('.restart'), function() {
		location.reload();
	});
	$('.modal-content').on('click', ('.play-again'), function() {
		location.reload();
	})
}

//Removes stars as number of moves increases.
/*
1. Behaviour: Removes a star when a set number of moves are reached.
2. Inputs: moveCount
3. Outputs: Removed star, number of stars left in variable 'star'.
*/
function starRating() {
	if (moveCount === 35) {
		$('#one').css('display', 'none');
		star = '2 stars';
	}
	if (moveCount === 45) {
		$('#two').css('display', 'none');
		star = '1 star';
	}
	if (moveCount === 50) {
		$('#three').css('display', 'none');
		star = '0 stars';
	}
}

function resetStarRating() {
	$('.stars .fas').css('display', 'inline');
}

function resetMatchedCards() {
	matchedCards.length = 0;
	$('.deck li').toggleClass('open show match');
}

//Call functions.
shuffle(symbols);
createCard();
startTimer();
playGame();
restartGame();
