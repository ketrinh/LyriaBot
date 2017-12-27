"use strict";
var Deck = require('./deck.js');

var pDeck = new Deck();

pDeck.new_Deck();

pDeck.remove_Card("jokers");
pDeck.new_Deck();
if (pDeck.deck_Total() === 52) {
    console.log("Remove success.");
}
else {
    console.log("Remove card Fail.");
}

pDeck.remove_Card("10");
pDeck.new_Deck();

var aDeck = new Deck();
aDeck.new_Deck();

var card = aDeck.pick_Card();
console.log("Card Picked: " + card);