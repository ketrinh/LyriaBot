"use strict";
var Deck = require('./deck.js');

console.log("Beginning Unit Testing of deck.js file...\n");
var successCount = 0;
var failCount = 0;
var pDeck = new Deck();

// Test new_Deck()
pDeck.new_Deck();
if (pDeck.deck_Total() === 56) {
    console.log("Test 0 passed.");
    successCount++;
}
else {
    console.log("Test 0 failed.");
    failCount++;
}

// Test remove_Card(cardtype)
pDeck.remove_Card("jokers");
pDeck.new_Deck();
if (pDeck.deck_Total() === 52) {
    //console.log("Remove success.");
    console.log("Test 1 passed.");
    successCount++;
}
else {
    //console.log("Remove card Fail.");
    console.log("Test 1 failed.");
    failCount++;
}

// Test remove_Card(integer)
pDeck.remove_Card("10");
pDeck.new_Deck();
if (pDeck.deck_Total() === 48) {
    console.log("Test 2 passed.");
    successCount++;
}
else {
    console.log("Test 2 failed.");
    failCount++;
}

// Test pick_Card() function
var aDeck = new Deck();
aDeck.new_Deck();
var card = aDeck.pick_Card();
if (card === undefined) {
    console.log("Test 3 failed.");
    failCount++;
}
else {
    console.log("Test 3 passed.");
    successCount++;
}

// Test Deck Class constructor
var bDeck = undefined;
bDeck = new Deck();
if (bDeck === undefined) {
    console.log("Test 4 failed.");
    failCount++;
}
else {
    console.log("Test 4 passed.");
    successCount++;
}

// Test pick_Card() deletion
bDeck.new_Deck();
var bCard = bDeck.pick_Card();
if (bDeck.deck_Total() === 55 && bCard !== undefined) {
    console.log("Test 5 passed.");
    successCount++;
}
else {
    console.log("Test 5 failed.");
    failCount++;
}

// Test pick_Card() randomness
bCard = bDeck.pick_Card();
var bCard2 = bDeck.pick_Card();
if (bCard !== bCard2) {
    console.log("Test 6 passed.");
    successCount++;
}
else {
    console.log("Test 6 failed.");
    failCount++;
}

// Test remove jack and queens
var cDeck = new Deck();
cDeck.remove_Card("jack");
cDeck.remove_Card("Queens");
cDeck.new_Deck();
if (cDeck.deck_Total() === 48) {
    console.log("Test 7 passed.");
    successCount++;
}
else {
    console.log("Test 7 failed.");
    failCount++;
}





console.log("Unit Testing Finished. Results: " + successCount + " successes, " + failCount + " failures.");