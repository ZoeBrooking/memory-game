/*
 * Create a list that holds all of your cards
 */

let cards = [];
let symbols = ['fas fa-anchor',
	'fas fa-anchor',
	'far fa-paper-plane',
	'far fa-paper-plane',
	'fas fa-bolt',
	'fas fa-bolt',
	'fas fa-cube',
	'fas fa-cube',
	'fas fa-leaf',
	'fas fa-leaf',
	'fas fa-bicycle',
	'fas fa-bicycle',
	'far fa-gem',
	'far fa-gem',
	'fas fa-bomb',
	'fas fa-bomb'];
let openCards = [];
let matchedCards = [];
let seconds = 0;
let minutes = 0;
let hours = 0;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */


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

//Replacing each symbol with one from the symbols array.
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
Event listener which listens for a click on the card and toggles the class to show the other side of the card.
Adds target card to array of open cards.
*/

let targetCard;
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
		endGame();
	}
}

//Takes the number of moves that the player has taken and displays them on the page.
function moveCounter() {
	$('.moves').text(moveCount);
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
function popUpModal(){
	$('.modal').css('display', 'block');
	$('#congrats-text').text('Congratulations! You have completed the game in ' + time.html() + ' with ' + star + '.' + ' Click on the replay button to play again.');
	$('.modal-content').on('click', 'span', function () {
		$('.modal').css('display', 'none');
	});
}

//Initiates Congratulations window and stops timer.
function endGame() {
	if (matchedCards.length === 16) {
		stopTimer();
		popUpModal();
	}
}

//Completely resets the page.
function restartGame() {
	$('.container').on('click', ('.restart'), function() {
		location.reload();
	})
}

let star = '3 stars';
//Removes stars as player gets to certain number of moves.
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


shuffle(symbols);
createCard();
startTimer();
playGame();
restartGame();



/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
