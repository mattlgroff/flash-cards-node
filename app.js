const deckModel = require('./deck.js');
const deck = new deckModel;

//Run with -create to make new decks and add cards
if (process.argv[2] === "-create") {
  deck.create();
}
//Run normally, in study mode.
else{
  deck.selector();
}
