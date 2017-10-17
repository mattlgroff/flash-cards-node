// **Deck**: A collection of Flashcards used to manage the Flashcards.
const inquirer = require('inquirer');
const fs = require('fs');
const cardModel = require('./card.js');
const card = new cardModel;
const deckFolder = './decks/';

const deck = function(){

}

deck.prototype.selector = () => {

  fs.readdir(deckFolder, (err, files) => {

    if (err){
      throw err;
    }

    let choicesArr = files.map((choice) => {
      let upper = choice.charAt(0).toUpperCase() + choice.slice(1);
      let sliced = upper.slice(0, -5);
      return sliced;
    });

    inquirer.prompt([
    {
      type: "list",
      name: "selectedDeck",
      message: "If you want to create a deck or add cards run this program with '-create'.\n\nWhich deck do you want to study?",
      choices: choicesArr,
      filter: (val) => val.toLowerCase()
    }
    ]).then((answers) => {

      let path = "./decks/" + answers.selectedDeck + ".json";
      let currentDeck = require(path);

      card.presentCard(currentDeck);

    }).catch((err) => {
      console.log(err);
    });
    
  });

  
}

deck.prototype.create = () => {
  let scope = this;

  inquirer.prompt([
  {
    type: "list",
    name: "createOptions",
    choices: ['Create New Deck', 'Add Question To Existing Deck', 'Exit'],
    message: "What do you want to do?",
    filter: (val) => val.toLowerCase()
  }
  ]).then((answers) => {

    switch(answers.createOptions) {

      case "create new deck":
          inquirer.prompt([
          {
            type: "input",
            name: "name",
            message: "What do you want the name of the deck to be?",
            filter: (val) => val.toLowerCase()
          }
          ]).then((answers) => {

            let upperName = answers.name.charAt(0).toUpperCase() + answers.name.slice(1);

            let object = {
              "name": upperName,
              "cards": []
            }

            let path = "./decks/" + answers.name + ".json";

            fs.writeFile(path, JSON.stringify(object, null, 2) , 'utf-8', (err) => {
              if (err) {
                throw err;
              }

              console.log("Successfully written to " + path);
              console.log("\nRun with -create again to add a question to your deck.");
            });

          }).catch((err) => {
            console.log(err);
          });

      break;

      case "add question to existing deck":

        fs.readdir(deckFolder, (err, files) => {

          if (err){
            throw err;
          }

          let choicesArr = files.map((choice) => {
            let upper = choice.charAt(0).toUpperCase() + choice.slice(1);
            let sliced = upper.slice(0, -5);
            return sliced;
          });

          inquirer.prompt([
          {
            type: "list",
            name: "selectedDeck",
            message: "Which deck do you want to add a question to?",
            choices: choicesArr,
            filter: (val) => val.toLowerCase()
          }
          ]).then((answers) => {

            let path = "./decks/" + answers.selectedDeck + ".json";
            
            fs.readFile(path, 'utf-8', function (err, data) {
              if (err){
                throw err;
              } 

              let object = JSON.parse(data);

              console.log(object.name);

              inquirer.prompt([
              {
                type: "input",
                name: "question",
                message: "Please type the question you want to add to the deck named: " + object.name + "\n"
              },
              {
                type: "input",
                name: "answer",
                message: "Please type the answer you want to add.",
                filter: (val) => val.toLowerCase()
              }
              ]).then((res) => {
                
                let content = {
                  "question": res.question,
                  "answer": res.answer
                }

                object.cards.push(content);

                fs.writeFile(path, JSON.stringify(object, null, 2) , 'utf-8', (err) => {
                  if (err) {
                    throw err;
                  }

                  console.log("Successfully written to " + path);
                  console.log("\nRun with -create again to add another question to your deck.");
                });



              }).catch((err) => {
                console.log(err);
              });

            });

          }).catch((err) => {
            console.log(err);
          });
        
      });


      break;

      case "exit":
        process.exit();
      break;

      default:
        console.log("Something went wrong. Default choice selected.");
      break;


    }

    
   

  }).catch((err) => {
    console.log(err);
  });


}

function clear (){
  process.stdout.write('\u001B[2J\u001B[0;0f');
}

module.exports = deck;  