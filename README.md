# ChessNeuralNet
A WIP Chess AI

To-Do

- [x] Make a program to generate the board

- [x] Make a program to enforce the rules of chess

- [x] Make a program to look ahead for better moves

- [x] Make the "AI" 

- [Work In Progress] Host on a server/website (Heroku )

### How to play
	
	When playing, I recommend having your browser's console open to issue commands and view the computer player's 'thinking' through each move.
	
    To play against the computer, simply make a move. You will play as the white side. The computer will then make a move.

    The computer is currently set to look 3 moves ahead using minimax with alpha beta pruning.

#### Computer vs Computer
	
	If you'd like to have the computer play the computer, you can do so with this command in your browser's console, setting the algorithm you'd like to use, and each computer player's 'skill' level.
	
	```
	playGame(algo=4, skillW=2, skillB=2)
	// algo=
	// 1 - random
	// 2 - Best move, one move ahead
	// 3 - Best move, n moves ahead, minimax
	// 4 - Best move, n moves ahead, minimax with alpha beta pruning (Faster)
    // skillW and skillB are how many moves ahead to look
	```
	
	`skillW` and `skillB` only work with alogs 3 & 4. The skill level is what sets how many moves ahead each player will look.
	
	Algo 3 does not use alpha beta pruning, so setting skill levels greater than 2 will make move times very long.
	
	Algo 4 uses alpha beta pruning, so you can set skill level up to 3, maybe even 4. But beyond that, move times will be very long.
