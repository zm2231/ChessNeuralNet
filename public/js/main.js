let Chess = require("./chess.min.js");
let eval1 = require("./evaluation").boardEvaluation1;
let eval2 = require("./evaluation").boardEvaluation2;
let game = new Chess();
// Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(algo, skill = 3, evalType = 1) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log("game over");
    return;
  }
  // Calculate the best move, using chosen algorithm
  if (algo === 1) {
    var move = randomMove();
  } else if (algo === 2) {
    var move = calcBestMoveOne(game.turn(), evalType);
  } else if (algo === 3) {
    var move = calcBestMoveNoAB(skill, game, game.turn(), true, evalType)[1];
  } else {
    var move = calcBestMove(evalType, skill, game, game.turn())[1];
  }
  // console.log(move);
  // Make the calculated move
  game.move(move);
  // Update board positions
  // board.position(game.fen());
};

// Computer vs Computer
var playGame = function(
  algoW = 4,
  algoB = 4,
  skillW = 2,
  skillB = 1,
  evalW = 1,
  evalB = 1
) {
  if (game.game_over() === true) {
    let winner = game.turn() === "w" ? "Black" : "White";
    // process.exit();
    game.reset();
    return winner;
  }
  let skill = game.turn() === "w" ? skillW : skillB;
  let algo = game.turn() === "w" ? algoW : algoB;
  let evalType = game.turn() === "w" ? evalW : evalB;
  makeMove(algo, skill, evalType);
  // setTimeout(function() {
  return playGame(algoW, algoB, skillW, skillB, evalW, evalB);
  // }, 10);
};

/**
 * Finds a random move to make
 * @return {string} move to make
 */
var randomMove = function() {
  var possibleMoves = game.moves();
  var randomIndex = Math.floor(Math.random() * possibleMoves.length);
  return possibleMoves[randomIndex];
};

/**
 * Calculates the best move looking one move ahead
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @return {string} the best move
 */
var calcBestMoveOne = function(playerColor, evalType) {
  let evaluateBoard = evalType == 1 ? eval1 : eval2;
  // List all possible moves
  var possibleMoves = game.moves();
  // Sort moves randomly, so the same move isn't always picked on ties
  possibleMoves.sort(function(a, b) {
    return 0.5 - Math.random();
  });

  // exit if the game is over
  if (game.game_over() === true || possibleMoves.length === 0) return;

  // Search for move with highest value
  var bestMoveSoFar = null;
  var bestMoveValue = Number.NEGATIVE_INFINITY;
  possibleMoves.forEach(function(move) {
    game.move(move);
    var moveValue = evaluateBoard(game.board(), playerColor);
    if (moveValue > bestMoveValue) {
      bestMoveSoFar = move;
      bestMoveValue = moveValue;
    }
    game.undo();
  });

  return bestMoveSoFar;
};

/**
 * Calculates the best move using Minimax without Alpha Beta Pruning.
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @param {Number} evalType - Which evaluation function to use
 * @return {Array} The best move value, and the best move
 */
var calcBestMoveNoAB = function(
  depth,
  game,
  playerColor,
  isMaximizingPlayer = true,
  evalType
) {
  let evaluateBoard = evalType == 1 ? eval1 : eval2;

  // Base case: evaluate board
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null];
  }

  // Recursive case: search possible moves
  var bestMove = null; // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b) {
    return 0.5 - Math.random();
  });
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value of this move
    value = calcBestMoveNoAB(
      depth - 1,
      game,
      playerColor,
      !isMaximizingPlayer
    )[0];
    // Log the value of this move
    // console.log(
    //   isMaximizingPlayer ? 'Max: ' : 'Min: ',
    //   depth,
    //   move,
    //   value,
    //   bestMove,
    //   bestMoveValue
    // );

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
    }
    // Undo previous move
    game.undo();
  }
  // Log the best move at the current depth
  // console.log(
  //   'Depth: ' + depth + ' | Best Move: ' + bestMove + ' | ' + bestMoveValue
  // );
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
};

/**
 * Calculates the best move using Minimax with Alpha Beta Pruning.
 * @param {Number} evalType - Which evaluation function to use
 * @param {Number} depth - How many moves ahead to evaluate
 * @param {Object} game - The game to evaluate
 * @param {string} playerColor - Players color, either 'b' or 'w'
 * @param {Number} alpha
 * @param {Number} beta
 * @param {Boolean} isMaximizingPlayer - If current turn is maximizing or minimizing player
 * @return {Array} The best move value, and the best move
 */
var calcBestMove = function(
  evalType,
  depth,
  game,
  playerColor,
  alpha = Number.NEGATIVE_INFINITY,
  beta = Number.POSITIVE_INFINITY,
  isMaximizingPlayer = true
) {
  let evaluateBoard = evalType == 1 ? eval1 : eval2;
  // Base case: evaluate board
  if (depth === 0) {
    value = evaluateBoard(game.board(), playerColor);
    return [value, null];
  }

  // Recursive case: search possible moves
  var bestMove = null;
  // best move not set yet
  var possibleMoves = game.moves();
  // Set random order for possible moves
  possibleMoves.sort(function(a, b) {
    return 0.5 - Math.random();
  });
  // Set a default best move value
  var bestMoveValue = isMaximizingPlayer
    ? Number.NEGATIVE_INFINITY
    : Number.POSITIVE_INFINITY;
  // Search through all possible moves
  for (var i = 0; i < possibleMoves.length; i++) {
    var move = possibleMoves[i];
    // Make the move, but undo before exiting loop
    game.move(move);
    // Recursively get the value from this move
    value = calcBestMove(
      evalType,
      depth - 1,
      game,
      playerColor,
      alpha,
      beta,
      !isMaximizingPlayer
    )[0];
    // Log the value of this move
    // console.log(
    //   isMaximizingPlayer ? 'Max: ' : 'Min: ',
    //   depth,
    //   move,
    //   value,
    //   bestMove,
    //   bestMoveValue
    // );

    if (isMaximizingPlayer) {
      // Look for moves that maximize position
      if (value > bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      alpha = Math.max(alpha, value);
    } else {
      // Look for moves that minimize position
      if (value < bestMoveValue) {
        bestMoveValue = value;
        bestMove = move;
      }
      beta = Math.min(beta, value);
    }
    // Undo previous move
    game.undo();
    // Check for alpha beta pruning
    if (beta <= alpha) {
      // console.log('Prune', alpha, beta);
      break;
    }
  }
  // Log the best move at the current depth
  // console.log(
  //   'Depth: ' +
  //     depth +
  //     ' | Best Move: ' +
  //     bestMove +
  //     ' | ' +
  //     bestMoveValue +
  //     ' | A: ' +
  //     alpha +
  //     ' | B: ' +
  //     beta
  // );
  // Return the best move, or the only move
  return [bestMoveValue, bestMove || possibleMoves[0]];
};

module.exports = {
  playGame
};
