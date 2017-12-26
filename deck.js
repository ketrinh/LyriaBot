function Deck() {
    var suits_Set = ["C", "H", "S", "D"];
    var card_Set = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A", "X"];

    var current_deck = [];
}

Deck.prototype.new_Deck = function() {
    for (suit in this.suits_Set) {
        for (card_num in this.card_Set) {
            this.current_deck.push(suit + card_num);
        }
    }
    console.log(this.current_deck);
};

Deck.prototype.remove_Card = function(card_type) {
    card_type = card_type.toUpperCase();
    if (card_type.contains("JOKER")) {
        this.card_Set.splice(this.card_Set.indexOf("X"),1);
        return;
    }
    var input_type = Number(card_type);
    if (!(isNaN(input_type)) && (this.card_Set.indexOf(card_type) != -1)) {
        this.card_Set.splice(this.card_Set.indexOf(card_type), 1);
        return;
    }
    var card_char = card_type.charAt(0);
    if (this.suits_Set.includes(card_char)) {
        this.suits_Set.splice(this.suits_Set.indexOf(card_char), 1);
        return;
    }
    else if (this.card_Set.includes(card_char)) {
        this.card_Set.splice(this.card_Set.indexOf(card_char), 1);
        return;        
    }
    console.log("ERROR - remove_Card invalid input.");
};

Deck.prototype.deck_Total = function() {
    return this.current_deck.length;
};

Deck.prototype.pick_Card = function() {
    if (this.current_deck.length >= 1) {
        return this.current_deck[Math.floor(Math.random()* this.current_deck.length)];
    }
    console.log("ERROR - Not enough cards in deck.");
};