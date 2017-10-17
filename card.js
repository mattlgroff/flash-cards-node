// **Card**: Used to create an object representing a Flashcard.
// A Flashcard should consist of 2 sides, one representing the 
// keyword/statement and the other the answer. For simplicity, 
// it is recommended to make the answer side's value limited 
// to a maximum of two words.
const inquirer = require('inquirer');

const cardModel = function(){
  this.counter = 0;
}

cardModel.prototype.presentCard = function(currentDeck) {
  let scope = this;

  if(currentDeck.cards[0].question === undefined){
    console.log("You need to add a question to this deck! Run this program again with '-create'.");
  }
  else {
    inquirer.prompt([
    {
      type: "list",
      name: "cardOption",
      message: "Current Deck: " + currentDeck.name 
      + "\nQuestion: " + (scope.counter + 1) + " of " + currentDeck.cards.length + " : " + currentDeck.cards[scope.counter].question
      + "\n\n Which option to you want?",
      choices: ['Answer', 'Flip', 'Next', 'Exit'],
      filter: (val) => val.toLowerCase()
    }
    ]).then( function(answer) {
      //Clear the screen
      clear();

      switch(answer.cardOption) {
        case "answer":
          //Let them attempt to guess
          inquirer.prompt([
          {
            type: "input",
            name: "guess",
            message: "Current Deck: " + currentDeck.name + "\nQuestion: " + (scope.counter + 1) + " of " + currentDeck.cards.length + " : " + currentDeck.cards[scope.counter].question + "\n",
            filter: (val) => val.toLowerCase()
          }
          ]).then( function(answer) {
            clear();

            if (answer.guess === currentDeck.cards[scope.counter].answer) {
              console.log("Correct! The answer was: " + currentDeck.cards[scope.counter].answer);
            } 
            else {
              console.log("Wrong! Try Again?");
            }

            scope.presentCard(currentDeck);

          }).catch((err) => {
            console.log(err);
          });
        break;

        case "flip":
          //Clear the screen
          clear();

          //Show them the answer
          console.log("Flipped! The Answer is: " + currentDeck.cards[scope.counter].answer + "\n");
          scope.presentCard(currentDeck);
        break;

        case "next":
          //Clear the screen
          clear();

          //Move onto the next card. counter++
          if(scope.counter >= currentDeck.cards.length - 1){
            console.log("You are out of questions! Starting the deck over.\n")
            scope.counter = 0;
            scope.presentCard(currentDeck);
          }
          else {
           scope.counter++;
           scope.presentCard(currentDeck);
          }
        break; 

        case "exit":
          process.exit();
        break;

        default:
          //Hopefully not possible
          console.log("Default option chosen.");
        break;  
      }

    }).catch((err) => {
      console.log(err);
    });
  }

}

function clear (){
  process.stdout.write('\u001B[2J\u001B[0;0f');
}

module.exports = cardModel;  
