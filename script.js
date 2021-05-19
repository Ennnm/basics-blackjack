var comPlayerCards = []; //computer is index 0, followed by the rest of the players
// var playerScores=[];
var comPlayerLoot = [];
var comPlayerScore = [];
//first card is faced up, second card is faced down
var shuffledDeck = [];

var gameMode = "toStart";
var numOfPlayers = 0;
var playersPlaying = [];
var cardDealt = null;
var playerString;
var numOfgames;

var deck = function () {
  var cardDeck = [];
  var suits = ["hearts", "diamonds", "clubs", "spades"];

  for (var i = 0; i < suits.length; i++) {
    var cardSuit = suits[i];
    for (var j = 1; j <= 13; j++) {
      var cardName = j;
      var rank = j;
      if (cardName == 1) cardName = "ace";
      else if (cardName == 11) {
        cardName = "jack";
        rank = 10;
      } else if (cardName == 12) {
        cardName = "queen";
        rank = 10;
      } else if (cardName == 13) {
        cardName = "king";
        rank = 10;
      }

      var card = { name: cardName, suit: suits[i], rank: rank };
      // console.log(`${cardName}  ${cardSuit}   ${j}`);
      cardDeck.push(card);
    }
  }
  return cardDeck;
};

var shuffleDeck = function (deck) {
  for (var i = 0; i < deck.length; i++) {
    var randomCardIndex = Math.floor(Math.random() * 52);
    //store value of current card
    var tempCardHolder = deck[i];
    //swap random card with current card
    deck[i] = deck[randomCardIndex];
    deck[randomCardIndex] = tempCardHolder;
  }
  return deck;
};

var sumOfHand = function (cardHand) {
  var sum = 0;
  var acePresent = false;
  for (var i = 0; i < cardHand.length; i++) {
    if (cardHand[i].rank == 1) acePresent = true;
    sum += cardHand[i].rank;
  }
  //decide now or decide via user input?
  if (acePresent == true && sum < 12) {
    sum += 10;
  }
  return sum;
};

var isGameFinished = function (playersPlaying) {
  var playing = false;
  //computer
  if (playersPlaying[0] == false) return true;
  for (var i = 0; i < playersPlaying.length; i++) {
    playing = playing || playersPlaying[i];
  }

  return !playing;
};
//evaluate for each round
var playerPlayStatus = function (number, playerId, playersPlaying) {
  if (number == 21) {
    playersPlaying[playerId] = false;
  } else if (number > 21) {
    playersPlaying[playerId] = false;
  }
  return playersPlaying;
};
//evaluate for each round
var assignWinsLosses = function (number, computerNum, playerId, comPlayerLoot) {
  if (number == 21) {
    comPlayerLoot[0] = comPlayerLoot[0] - 1.5;
    comPlayerLoot[playerId] = comPlayerLoot[playerId] + 1.5;
  } else if (number > 21 && playerId != 0) {
    comPlayerLoot[0] = comPlayerLoot[0] + 1;
    comPlayerLoot[playerId] = comPlayerLoot[playerId] - 1;
    //if computer bust, evaluated only when its computer turn
  } else if (computerNum > 21 && number < 22) {
    for (var j = 1; j < playersPlaying.length; j++) {
      if (playersPlaying[j] == true) {
        comPlayerLoot[0] = comPlayerLoot[0] - 2;
        comPlayerLoot[j] = comPlayerLoot[j] + 2;
      }
    }
    //comparison to computer
  } else if (number > computerNum && playerId != 0) {
    console.log(`hey`);
    comPlayerLoot[0] = comPlayerLoot[0] - 2;
    comPlayerLoot[playerId] = comPlayerLoot[playerId] + 2;
  } else if (number <= computerNum && playerId != 0) {
    console.log(`you`);
    comPlayerLoot[playerId] = comPlayerLoot[playerId] - 1;
    comPlayerLoot[0] = comPlayerLoot[0] + 1;
  }
  return comPlayerLoot;
};

var outputStringForScores = function (number, playerId) {
  var output = "";
  if (number == 21) {
    output = `player ${playerId} win 1.5 coins! with 21`;
  } else if (number < 21 && playerId != 0) {
    output = `total: ${number}`;
  } else if (number > 21 && playerId != 0) {
    output = "busted";
  } else if (number > 21 && playerId == 0) {
    output = `💻 dealer has busted, all remaining players get 2 coins`;
  }
  return output;
};

var outputStringStatus = function (numOfPlayers, comPlayerCards) {
  var output = "";
  for (var i = 0; i <= numOfPlayers; i++) {
    for (var j = 0; j < comPlayerCards[i].length; j++) {
      //computer draws
      if (i == 0) {
        //second draw
        if (j == 1) {
          output += `💻 dealer second draw is a secret<br>`;
        } else {
          output += `💻 dealer has drawn ${comPlayerCards[i][j].name} of ${comPlayerCards[i][j].suit}<br>`;
        }
      }
      //player draws
      else {
        output += `player ${i} has drawn ${comPlayerCards[i][j].name} of ${comPlayerCards[i][j].suit}<br>`;
      }
    }
    comPlayerScore[i] = sumOfHand(comPlayerCards[i]);
    output += outputStringForScores(comPlayerScore[i], i);
    output += `<br><br>`;
    // `💻 dealer has busted, all remaining players get 2 coins`;
  }

  return output;
};
//everyone places one bet
//one card face up to each person
//everyone but dealer have one more faceup card

//dealer dealt one face down card
//ace can be one or eleven
//==21, 1.5 times bet from dealer and done for round

//more card, hit hit
//>21 bust and dealer takes 1 times bet
// stay for no more cards
//oncce done a round, dealer flips card up
//if less than <16 dealt another card
//if >16, dealer stay with hand
//if dealer>21 everyplayer in round wins double bet
//if not, only player hand> dealer wins twice bet
//everyone else loses bet
var playerhitting = 0;
var main = function (input) {
  var output = "";
  // if (shuffledDeck.length<)
  if (gameMode == "toStart") {
    shuffledDeck = shuffleDeck(deck());
    if (isNaN(Number(input))) {
      return `please return a number more than 1.`;
    } else {
      //need to convert to number
      numOfPlayers = Number(input);
      //computer dealer+ num of players
      for (var i = 0; i <= numOfPlayers; i++) {
        comPlayerCards.push([]);
        comPlayerLoot.push(100);
        comPlayerScore.push(0);
        playersPlaying.push(true);
      }
      //some how pushing to the array below adds to the length of all arrays
      // comPlayerCards = new Array(numOfPlayers + 1).fill([]);
      // comPlayerLoot = new Array(numOfPlayers + 1).fill(0);

      gameMode = "dealing";
      numOfgames = 1;
      return `there are ${numOfPlayers} players. one bet has been placed for each    player<br><br>click to deal.`;
    }
  } else if (gameMode == "dealing") {
    gameMode = "dealingExtra";
    for (var i = 0; i <= numOfPlayers; i++) {
      if (shuffledDeck < 2) {
        return `no enough cards to deal`;
      }

      comPlayerCards[i].push(shuffledDeck.pop());
      comPlayerCards[i].push(shuffledDeck.pop());
    }

    output += `here are the draws:<br><br>`;
    output += `key in the player numbers for those who wants to hit. e.g. 1,2,3<br><br>press submit if all choose to stay <br><br> `;
    console.log(`dealing`);

    if (isGameFinished(playersPlaying)) {
      gameMode = "finishGame";
    }
    output += outputStringStatus(numOfPlayers, comPlayerCards);
    return output;
  } else if (gameMode == "dealingExtra") {
    console.log(`dealingX`);

    if (input.length == 0) {
      gameMode = "finishGame";
    } else {
      playerString = input.split(",");
      for (var i = 0; i < playerString.length; i++) {
        playerhitting = Number(playerString[i]);
        if (shuffledDeck == 0) {
          return `no more cards to deal`;
        }
        comPlayerCards[playerhitting].push(shuffledDeck.pop());
      }
    }
    if (isGameFinished(playersPlaying)) {
      gameMode = "finishGame";
    }
    output += outputStringStatus(numOfPlayers, comPlayerCards);
    return output;
  }
  //split mode focus on players that split, player given option to split when they have two of the same suit of card
  //make method for checking if cards are identical
  //if identical, make new array for special player , have them bet for each hand,
  //let them split until satisfied
  //go back to dealingX mode when they choose not to split, input array of array into comPlayercards
  //subsequent strings has to be able to evaluate if

  //output strings
  //need to include condition for when deck has no more cards
  if (gameMode == "finishGame") {
    numOfgames++;
    var computerHand = sumOfHand(comPlayerCards[0]);
    if (computerHand < 16 && shuffledDeck.length > 0) {
      comPlayerCards[0].push(shuffledDeck.pop());
    }
    //new hand sum
    computerHand = sumOfHand(comPlayerCards[0]);

    for (var i = 0; i <= numOfPlayers; i++) {
      comPlayerScore[i] = sumOfHand(comPlayerCards[i]);
      playersPlaying = playerPlayStatus(comPlayerScore[i], i, playersPlaying);
      comPlayerLoot = assignWinsLosses(
        comPlayerScore[i],
        computerHand,
        i,
        comPlayerLoot
      );
    }
    output += `💻 dealer has ${comPlayerScore[0]} points with ${comPlayerCards[0][0].name} of ${comPlayerCards[0][0].suit}`;
    for (var i = 1; i < comPlayerCards[0].length; i++) {
      output += `, ${comPlayerCards[0][i].name} of ${comPlayerCards[0][i].suit}        `;
    }

    output += `<br><br>💻 dealer has ${comPlayerLoot[0]} coins<br><br> `;
    for (var i = 1; i <= numOfPlayers; i++) {
      output += `player ${i} has ${comPlayerLoot[i]} coins<br><br> `;
    }
    output += `will start a new game no. ${numOfgames}.<br><br>`;
    output += outputStringStatus(numOfPlayers, comPlayerCards);

    gameMode = "dealing";

    //reset variables
    comPlayerScore = new Array();
    comPlayerCards = new Array();
    playersPlaying = new Array();
    for (var i = 0; i <= numOfPlayers; i++) {
      shuffledDeck = shuffleDeck(deck());
      comPlayerCards.push([]);
      comPlayerScore.push(0);
      playersPlaying.push(true);
    }
    return output;
  }
};
