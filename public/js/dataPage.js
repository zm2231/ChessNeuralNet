

window.onload = function() {

   var grid = document.getElementById("chessGrid");

   var i = 0;
   var alternate = false;
   for (const [whiteDifficulty, opponents] of Object.entries(testedGamesData))
   {
      for (const [blackDifficulty, games] of Object.entries(opponents))
      {
         for (var j = 0; j < games.length; j++)
         {
            var gameData = games[j];
            
            var parentDiv = document.createElement("DIV");
            parentDiv.style = "padding: 20px 10px;" + (alternate ? "background-color: #e3e3e3;" : "");
            grid.appendChild(parentDiv);
            {
               // Title
               var title = document.createElement("H3");
               title.innerText = whiteDifficulty + "\n" + blackDifficulty;

               // Game State
               var state = document.createElement("P");
               if (gameData.loss)
               {
                  state.innerText = gameData.loss === "w" ? "Black Won!" : "White Won!";
               }
               else if (gameData.draw)
               {
                  if (gameData.stalemate)
                  {
                     state.innerText = "Stalemate";
                  }
                  else if (gameData.repetition)
                  {
                     state.innerText = "Repetition";
                  }
                  else
                  {
                     state.innerText = "Draw";
                  }
               }

               // moves
               var moves = document.createElement("P");
               moves.innerText = "Num Moves: " + gameData.numMoves;

               // time
               var time = document.createElement("P");
               var date = new Date(null);
               date.setSeconds(gameData.gameTime / 1000);
               var timeString = date.toISOString().substr(11, 8);
               time.innerText = "Time: " + timeString;

               // board
               var item = document.createElement("DIV");
               item.id = "board" + i;
               item.style = "width: 200px";

               parentDiv.appendChild(title);
               parentDiv.appendChild(state);
               parentDiv.appendChild(moves);
               parentDiv.appendChild(time);
               parentDiv.appendChild(item);

               var board = ChessBoard('board' + i, { draggable: false, position: gameData["fen"]});
            }

            i++;
         }
         alternate = !alternate;
      }
   }

}




var saveTestDataOutcomes = function() {
   var aiOutcomesColor = {};
   var aiOutcomes = {};

   var updateOutcomes = function(obj, win, draw)
   {
      if (!("wins" in obj))
      {
         obj["wins"] = 0;
      }
      if (!("losses" in obj))
      {
         obj["losses"] = 0;
      }
      if (!("draws" in obj))
      {
         obj["draws"] = 0;
      }

      if (draw)
         obj["draws"]++;
      else if (win)
         obj["wins"]++;
      else
         obj["losses"]++;
   }

   for (const [whiteDifficulty, opponents] of Object.entries(testedGamesData))
   {
      var whitePlayer = whiteDifficulty.replace("white:", "");
      for (const [blackDifficulty, games] of Object.entries(opponents))
      {
         var blackPlayer = blackDifficulty.replace("black:", "");
         for (var j = 0; j < games.length; j++)
         {
            var gameData = games[j];
            
            var winner = "";
            var draw = gameData.draw;
            if (gameData.loss)
            {
               winner = gameData.loss === "w" ? "b" : "w";
            }

            if(!(whiteDifficulty in aiOutcomesColor))
               aiOutcomesColor[whiteDifficulty] = {};
            if(!(blackDifficulty in aiOutcomesColor))
               aiOutcomesColor[blackDifficulty] = {};
            updateOutcomes(aiOutcomesColor[whiteDifficulty], winner === "w", draw);
            updateOutcomes(aiOutcomesColor[blackDifficulty], winner === "b", draw);

            if(!(whitePlayer in aiOutcomes))
               aiOutcomes[whitePlayer] = {};
            if(!(blackPlayer in aiOutcomes))
               aiOutcomes[blackPlayer] = {};
            updateOutcomes(aiOutcomes[whitePlayer], winner === "w", draw);
            updateOutcomes(aiOutcomes[blackPlayer], winner === "b", draw);
         }
      }
   }

   console.save(aiOutcomes, "aiOutcomes.json");
   console.save(aiOutcomesColor, "aiOutcomesColor.json");
}


// Save function credit: http://programandconquer.com/save-console-browser-json-file/
console.save = function(data, filename){

      if(!data) {
         console.error('Console.save: No data')
         return;
      }

      if(!filename) filename = 'console.json'

      if(typeof data === "object"){
         data = JSON.stringify(data, undefined, 4)
      }

      var blob = new Blob([data], {type: 'text/json'}),
         e    = document.createEvent('MouseEvents'),
         a    = document.createElement('a')

      a.download = filename
      a.href = window.URL.createObjectURL(blob)
      a.dataset.downloadurl =  ['text/json', a.download, a.href].join(':')
      e.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      a.dispatchEvent(e)
}