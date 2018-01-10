"use strict";

class Deck {
    constructor() {
        this.card_types = {"CLUB":"C", "HEART":"H", "SPADE":"S", "DIAMOND":"D", "JACK":"J", "QUEEN":"Q", "KING":"K", "ACE":"A", "JOKER":"X"};
        this.suits_Set = [this.card_types["CLUB"], this.card_types["HEART"], this.card_types["SPADE"], this.card_types["DIAMOND"]];
        this.card_Set = ["2", "3", "4", "5", "6", "7", "8", "9", "10", this.card_types["JACK"], this.card_types["QUEEN"],
                            this.card_types["KING"], this.card_types["ACE"], this.card_types["JOKER"]];

        this.current_deck = [];
        // console.log("New Deck Object created.");
    }

    new_Deck() {
        this.current_deck = [];
        for (var i = 0; i < this.suits_Set.length; i++) {
            for (var j = 0; j < this.card_Set.length; j++) {
                this.current_deck.push(this.suits_Set[i] + this.card_Set[j]);
            }
        }
        // console.log("New Deck Created:");
        // console.log(this.current_deck);
        // console.log("Deck Size on Create: " + this.current_deck.length);
    }


    remove_Card(card_type) {
        card_type = card_type.toUpperCase();
        var card_char = "";
        for (var ct in this.card_types) {
            if (card_type.includes(ct)) {
                card_char = this.card_types[ct];
                if (this.suits_Set.includes(card_char)) {
                    this.suits_Set.splice(this.suits_Set.indexOf(card_char), 1);
                    return;
                }
                else if (this.card_Set.includes(card_char)) {
                    this.card_Set.splice(this.card_Set.indexOf(card_char), 1);
                    return;        
                }
            }
        }
        var input_type = Number(card_type);
        if (!(isNaN(input_type)) && (this.card_Set.indexOf(card_type) != -1)) {
            this.card_Set.splice(this.card_Set.indexOf(card_type), 1);
            return;
        }
        console.log("ERROR - remove_Card invalid input.");
    }
    
    deck_Total() {
        return this.current_deck.length;
    }
    
    pick_Card() {
        if (this.current_deck.length >= 1) {
            var index = Math.floor(Math.random()* this.current_deck.length);
            var card = this.current_deck[index];
            this.current_deck.splice(index, 1);
            return card;
        }
        console.log("ERROR - Not enough cards in deck.");
    }
}

module.exports = Deck