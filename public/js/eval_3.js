


var eval_3 = function (board, color)
{
   var totalEvaluation = 0;
   for (var i = 0; i < 8; i++)
   {
       for (var j = 0; j < 8; j++)
       {
           totalEvaluation = totalEvaluation + getPieceEvaluation3(board, color, i, j);
       }
   }
   return totalEvaluation;
};

var getPieceEvaluation3 = function (board, color, i, j)
{
   var piece = board[i][j];
   var opposite = color === "w" ? "b" : "w";
   var teamMultiplier = (piece === null || piece.color === color ? 1 : -1)

   // Sets the value for each piece using standard piece value [copied from eval_1]
   var pieceValue = {
      'p': 100,
      'n': 350,
      'b': 350,
      'r': 525,
      'q': 1000,
      'k': 10000,
   };

   // Sets the value of how important it is to have a piece protected
   var protectionImportance = {
      'p': 10,
      'n': 30,
      'b': 30,
      'r': 30,
      'q': 50,
      'k': 0     // not important to directly protect our own king
   };

   var thisValue = 0;
   if(piece !== null)
   {
      thisValue = pieceValue[piece.type];
      thisValue *= teamMultiplier;
   }

   var thisProtectionImportance = 1; // assume protection of empty squares is somewhat important
   if(piece !== null)
   {
      thisProtectionImportance = protectionImportance[piece.type];
      thisProtectionImportance *= (piece.color === color ? 1 : 0.5); // prefer to protect our pieces more than opponent's pieces

      if(piece.color === opposite && piece.type === "k")
         thisProtectionImportance = 500; // big bonus for "protecting" opponent's king
   }

   var ourProtection = 0;
   var theirProtection = 0;
   var totalProtection = 0;

   // protection from our pieces
   ourProtection += squareProtectionFromPawns(board, color, i, j);
   ourProtection += squareProtectionStraight(board, color, i, j);
   ourProtection += squareProtectionDiagonal(board, color, i, j);
   ourProtection += squareProtectionFromKnights(board, color, i, j);
   ourProtection += squareProtectionFromKing(board, color, i, j);

   // threats by other pieces
   theirProtection += squareProtectionFromPawns(board, opposite, i, j);
   theirProtection += squareProtectionStraight(board, opposite, i, j);
   theirProtection += squareProtectionDiagonal(board, opposite, i, j);
   theirProtection += squareProtectionFromKnights(board, opposite, i, j);
   theirProtection += squareProtectionFromKing(board, opposite, i, j);

   totalProtection = ourProtection;
   if (piece === null && squareProtectionFromKing(board, opposite, i, j) > 0) // increase importance if this square is empty and adjacent to opponent king
   {
      thisProtectionImportance += 300;
   }
   else if (piece === null && squareProtectionFromKing(board, color, i, j) > 0) // increase importance if this square is empty and adjacent to our king
   {
      thisProtectionImportance += 50;
   }
   else if (piece !== null && piece.color === opposite && piece.type === "k") // don't care about how opponent protect's their king
   {
      // written this way for readability
   }
   else
   {
      totalProtection -= theirProtection;
   }

   return thisValue + (totalProtection * thisProtectionImportance);
}

var squareProtectionFromPawns = function (board, color, i, j)
{
   var rowShift = color === "w" ? 1 : -1;
   var checkI = i + rowShift;

   var countProtections = 0;

   if (board[checkI] !== undefined)
   {
      // check for left diagonal pawn
      var piece = board[checkI][j-1];
      if (piece !== undefined && piece !== null && piece.color === color && piece.type === "p")
      {
         countProtections++;
      }

      // check for right diagonal pawn
      var piece = board[checkI][j+1];
      if (piece !== undefined && piece !== null && piece.color === color && piece.type === "p")
      {
         countProtections++;
      }
   }

   return countProtections;
}

var squareProtectionStraight = function (board, color, i, j)
{
   var countProtections = 0;

   var isTargetPiece = (piece) => (piece !== null && piece.color === color && (piece.type === "r" || piece.type === "q"));

   // check to the right
   if(protectionInDirection(board, i, j, 1, 0, isTargetPiece))
      countProtections++;
   
   // check to the left
   if(protectionInDirection(board, i, j, -1, 0, isTargetPiece))
      countProtections++;

   // check above
   if(protectionInDirection(board, i, j, 0, -1, isTargetPiece))
      countProtections++;

   // check below
   if(protectionInDirection(board, i, j, 0, 1, isTargetPiece))
      countProtections++;

   return countProtections;
}

var squareProtectionDiagonal = function (board, color, i, j)
{
   var countProtections = 0;

   var isTargetPiece = (piece) => (piece !== null && piece.color === color && (piece.type === "b" || piece.type === "q"));

   
   // right down
   if(protectionInDirection(board, i, j, 1, 1, isTargetPiece))
      countProtections++;
   
   // right up
   if(protectionInDirection(board, i, j, 1, -1, isTargetPiece))
      countProtections++;

   // left up
   if(protectionInDirection(board, i, j, -1, -1, isTargetPiece))
      countProtections++;

   // left down
   if(protectionInDirection(board, i, j, -1, 1, isTargetPiece))
      countProtections++;

   return countProtections;
}

var protectionInDirection = function(board, i, j, xDif, yDif, isTargetPiece)
   {
      var y = i + yDif;
      var x = j + xDif;
      while (y >= 0 && y < 8 && x >= 0 && x < 8)
      {
         var piece = board[i][x];
         if (isTargetPiece(piece))
         {
            return true;
         }
         else if (piece !== null) // path blocked by other piece
         {
            return false;
         }

         y = y + yDif;
         x = x + xDif;
      }
   }

var squareProtectionFromKnights = function (board, color, i, j)
{
   var countProtections = 0;

   var isTargetPiece = (piece) => (piece !== null && piece.color === color && piece.type === "n");

   //check above
   var checkI = i - 2;
   var checkJ = j - 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;
      
   checkJ = j + 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   //check below
   checkI = i + 2;
   checkJ = j - 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   checkJ = j + 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   //check left
   checkJ = j - 2;
   checkI = i - 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   checkI = i + 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   //check right
   checkJ = j + 2;
   checkI = i - 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   checkI = i + 1;
   if(board[checkI] !== undefined && board[checkI][checkJ] !== undefined && isTargetPiece(board[checkI][checkJ]))
      countProtections++;

   return countProtections;
}

var squareProtectionFromKing = function (board, color, i, j)
{
   var countProtections = 0;

   var isTargetPiece = (piece) => (piece !== null && piece.color === color && piece.type === "k");

   for(var x = -1; x <= 1; x++)
   {
      for(var y = -1; y <= 1; y++)
      {
         if(x !== i && y !== j)
            if(board[i+x] !== undefined && board[i+x][j+y] !== undefined && isTargetPiece(board[i+x][j+y]))
               countProtections++;      
      }
   }

   return countProtections;
}