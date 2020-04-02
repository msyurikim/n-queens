/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other



window.findNRooksSolution = function(n) {
  var solution = [];
  for (var i = 0; i < n; i++) {
    solution[i] = [];
    for (var j = 0; j < n; j++) {
      if (i === j) {
        solution[i][j] = 1;
      } else {
        solution[i][j] = 0;
      }
    }
  }
  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;

  if (n == 1) {
    solutionCount = 1;
  } else if (n === 2) {
    solutionCount = 2;
  } else {
    for (var i = 0; i < n; i++) {
      solutionCount += countNRooksSolutions(n-1);
    }
  }

  //console.log('Number of solutions for ' + n + ' rooks:', solutionCount);
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var solution = [];

  //console.log('Single solution for ' + n + ' queens:', JSON.stringify(solution));
  return solution;
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var solutionCount = 0;
  var matrix = [];
  for (var i = 0; i < n; i++) {
    matrix[i] = [];
    for (var j = 0; j < n; j++) {
      matrix[i][j] = 0;
    }
  }
  //instantiation rule in Board.js line 12, for empty board
  var board = new Board(matrix);

  var findSolution = function(row) {

    if (row === n) {
      solutionCount++;
      return;
    }

    //iterating through all columns for row
    for (var i = 0; i < n; i++) {
      //place piece
      board.togglePiece(row, i);
      if(!board['hasAnyQueenConflictsOn']()){
        //no conflicts, move to next row using recursion
        //keep recursing, if no conflict
        findSolution(row+1);
      }
      //else {
      //remove piece
        board.togglePiece();
    //}

    }

  };

  findSolution(0); //start from first row


  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};
