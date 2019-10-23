var start = function(){

  console.log('Enter info as follows:\nplayGame(skillW=(1,2,3), skillB=(1,2,3), evalW=(1,2), evalB=(1,2))');
  return;
};

// Computer makes a move with algorithm choice and skill/depth level
var makeMove = function(skill=1, eval=1) {
  // exit if the game is over
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  
  // alpha-beta pruning
  var move = calcBestMove(skill, game, game.turn(), eval)[1];
  
  // Make the calculated move
  game.move(move);
  // Update board positions
  board.position(game.fen());
}

// Computer vs Computer
var playGame = function(skillW=1, skillB=1, evalW=1, evalB=1) {
  if (game.game_over() === true) {
    console.log('game over');
    return;
  }
  var skill = game.turn() === 'w' ? skillW : skillB;
  var eval = game.turn() === 'w' ? evalW : evalB;
  makeMove(skill, eval);
  window.setTimeout(function() {
    playGame(skillW, skillB, evalW, evalB);
  }, 250);
};

// Handles what to do after human makes move.
// Computer automatically makes next move
var onDrop = function(source, target) {
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
    makeMove(4, 3);
  }, 250);
};
