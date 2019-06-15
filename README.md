# ChessNeuralNet
A WIP Chess AI

To-Do

- [x] Make a program to generate the board

- [x] Make a program to enforce the rules of chess

- [x] Make a program to look ahead for better moves

- [x] Make the "AI" 

- [Work In Progress] Host on a server/website (Heroku )

### API
	
	When playing, I recommend having your browser's console open to view the computer's logic.
	
	To play against the computer, simply make a move. You will play as the white side.
	
	If you'd like to have the computer play the computer, you can do so with this command in your browser's console:
	
	```
	playGame(algo=4, skillW=2, skillB=2)
	// algo
	// 1 - random
	// 2 - Best move, one move ahead
	// 3 - Best move, n moves ahead, minimax
	// 4 - Best move, n moves ahead, minimax with alpha beta pruning (Faster)
	```
	
	`skillW` and `skillB` decide `n` for algo 3 & 4.
	
	Algo 3 does not use alpha beta pruning, so anything above 2 takes a long time.
	
	Algo 4 uses alpha beta pruning, so 3 moves ahead shouldn't take too long.
