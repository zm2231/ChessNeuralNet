// Computer makes a move with eval choice and depth level
var makeMove = function(eval, depth=3) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  // Calculate the best move, using chosen algorithm
  var move = calcBestMove(eval, depth, game, game.turn())[1];
  // Make the calculated move
  game.move(move);
  // Update board positions
  board.position(game.fen());
}

var gamePaused = false;
var togglePause = function() {
   gamePaused = !gamePaused;

   document.getElementById("pauseButton").innerText = gamePaused ? "Resume" : "Pause";
}

var scoreSheet = {};
var currentGameStartTime = null;
var testManyGames = function(x = 0, i = 0, j = 0, k = 0, l = 0) {
   var evals = [eval_1, eval_2, eval_3];
   var depths = [1, 2, 3, 4];
   var numGames = 2;

   if(gamePaused)
   {
      window.setTimeout(function() {
         testManyGames(x, i, j, k, l);
      }, 500);
      return;
   }

   // White
   var evalW = evals[i];
   var depthW = depths[j]

   var whiteKey = "white:" + evalW.name + ",depth_" + depthW;
   if(scoreSheet[whiteKey] === undefined)
      scoreSheet[whiteKey] = {};

   //Black
   var evalB = evals[k];
   var depthB = depths[l]

   var blackKey = "black:" + evalB.name + ",depth_" + depthB;
   if (scoreSheet[whiteKey][blackKey] === undefined)
      scoreSheet[whiteKey][blackKey] = [];
   
   updateEvalInfo(evalW, depthW, evalB, depthB);

   if (currentGameStartTime === null)
   {
      game.reset();
      currentGameStartTime = window.performance.now();

      window.setTimeout(function() {
         testManyGames(x, i, j, k, l);
      }, 100);
      return;
   }
   else if (game.game_over())
   {
      var endTime = window.performance.now();
      var gameInfo = {
         'loss': game.in_checkmate() ? game.turn() : false,
         'draw': game.in_draw(),
         'stalemate': game.in_stalemate(),
         'repetition': game.in_threefold_repetition(),
         'fen': game.fen(),
         'numMoves': game.history().length,
         'gameTime': endTime - currentGameStartTime
      };
      scoreSheet[whiteKey][blackKey].push(gameInfo);

      game.reset();
      currentGameStartTime = window.performance.now();
   }
   else
   {
      var eval = game.turn() === 'w' ? evalW : evalB;
      var depth = game.turn() === 'w' ? depthW : depthB;
      makeMove(eval, depth);
      window.setTimeout(function() {
         testManyGames(x, i, j, k, l);
      }, 250);
      return;
   }

   x++;
   if(x >= numGames)
   {
      x = 0;
      l++;
   }
   if(l >= depths.length)
   {
      l = 0;
      k++;
   }
   if(k >= evals.length)
   {
      k = 0;
      j++;
   }
   if(j >= depths.length)
   {
      j = 0;
      i++;
   }

   if(i < evals.length)
   {
      window.setTimeout(function() {
         testManyGames(x, i, j, k, l);
      }, 100);
   }
}

var updateEvalInfo = function(evalW, depthW, evalB, depthB) {
   document.getElementById("gameTitle").innerText = "White: " + evalW.name + ", depth_" + depthW + "\n Black: " + evalB.name + ", depth_" + depthB;
   document.getElementById("eval_1").innerText = "eval_1 = w: " + eval_1(game.board(), "w") + "\t\tb: " + eval_1(game.board(), "b");
   document.getElementById("eval_2").innerText = "eval_2 = w: " + eval_2(game.board(), "w") + "\t\tb: " + eval_2(game.board(), "b");
   document.getElementById("eval_3").innerText = "eval_3 = w: " + eval_3(game.board(), "w") + "\t\tb: " + eval_3(game.board(), "b");
}

// Computer vs Computer
var playGame = function(evalW=eval_1, depthW=3, evalB=eval_1, depthB=3) {
   updateEvalInfo(evalW, depthW, evalB, depthB);

   if(clearFlag) {
      console.log("clearing board");
      //board.start();
      game.reset();
      return;
   }
   if (game.game_over() === true) {
      console.log('game over');
      return;
   }
   var eval = game.turn() === 'w' ? evalW : evalB;
   var depth = game.turn() === 'w' ? depthW : depthB;
   makeMove(eval, depth);
   window.setTimeout(function() {
      playGame(evalW, depthW, evalB, depthB);
   }, 250);
};

var clearFlag = false;
var resetBoard = function() {
  clearFlag = true;
}


var cpuEval = eval_1;
var cpuDepth = 1;
var assignCPU = function() {
   switch(document.getElementById("evalSelect").value)
   {
      case "eval_1": cpuEval = eval_1; break;
      case "eval_2": cpuEval = eval_2; break;
      case "eval_3": cpuEval = eval_3; break;
   }
   switch(document.getElementById("depthSelect").value)
   {
      case "depth_1": cpuDepth = 1; break;
      case "depth_2": cpuDepth = 2; break;
      case "depth_3": cpuDepth = 3; break;
   }
}

// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
   updateEvalInfo({name:"Human"}, "N/A", cpuEval, cpuDepth);

   // see if the move is legal
   var move = game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
   });

   // If illegal move, snapback
   if (move === null) return 'snapback';

   // Log the move
   console.log(move)

   // make move for black
   window.setTimeout(function() {
      makeMove(cpuEval, cpuDepth);
      updateEvalInfo({name:"Human"}, "N/A", cpuEval, cpuDepth);
   }, 250);
};
