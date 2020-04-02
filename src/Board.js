// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);

    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
     var row = this.get(rowIndex);
     var foundPiece = false;
     for (var i = 0; i< row.length ; i++){
       if (foundPiece && row[i] === 1){
         return true;
       }else if(row[i] === 1){
         foundPiece = true;
       }
     }
     return false;
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i =0 ; i< this.rows().length ; i++){
        if (this.hasRowConflictAt(i)){
          return true;
        }
      }
      return false;
    },
    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      //element name = row, this.rows() returns matrix = array of rows

      var col = this.rows().map( row => row[colIndex] );

      var foundPiece = false;
      for (var i = 0; i< col.length ; i++){
        if (foundPiece && col[i] === 1){
          return true;
        }else if(col[i] === 1){
          foundPiece = true;
        }
      }
      return false;
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      //index: 0 - n, i < n
      for (var i =0 ; i< this.rows().length ; i++){
        if (this.hasColConflictAt(i)){
          return true;
        }
      }
      return false;
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    // 0 0 0 -
    // 0 0 - 0
    // 0 - 0 0
    // - 0 0 0

    //row = 0, col = 1 --> offset = col - row = 1- 0 = 1
    //row = 1, col = 2 --> offset = 2 - 1 = 1
    //2 3, 3-2 =1




    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow, row = 0) {
      var board = this.rows();
      var offset = this._getFirstRowColumnIndexForMajorDiagonalOn(row , majorDiagonalColumnIndexAtFirstRow);
      var foundPiece = false;
      var diagonal = [];

      for ( var i = 0; i< board.length ; i++){
        for (var j = 0; j< board.length ; j++){
          if (this._getFirstRowColumnIndexForMajorDiagonalOn(i, j) === offset) {
            diagonal.push(board[i][j]);
          }
        }
      }

      for (var k = 0 ; k< diagonal.length; k++){
        if ( diagonal[k] === 1 && foundPiece){
          return true;
        }else if (diagonal[k] === 1){
          foundPiece = true;
        }
      }

      return false;
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //1st row, every column
      for (var i = 0 ; i < this.rows().length ; i++){
        if (this.hasMajorDiagonalConflictAt(i)){
          return true;
        }
      }

      for (var j = 1 ; j < this.rows().length ; j++){
        if (this.hasMajorDiagonalConflictAt(0 , j)){
          return true;
        }
      }
      //every row (after 0), col = 0
      //for loop: r = 1 -> board.length
        //if (this.hadMajor...(0, r)) return true

      return false;
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow, row = 0) {
      var board = this.rows();
      var offset = this._getFirstRowColumnIndexForMinorDiagonalOn(row, minorDiagonalColumnIndexAtFirstRow);
      var foundPiece = false;
      var diagonal = [];

      for (var i = 0; i < board.length; i++) {
        for (var j = minorDiagonalColumnIndexAtFirstRow; j >= 0; j--) {
          if (this._getFirstRowColumnIndexForMinorDiagonalOn(i, j) === offset) {
            diagonal.push(board[i][j]);
          }
        }
      }
      for (var k = 0; k < diagonal.length; k++) {
        if (diagonal[k] === 1 && foundPiece) {
          return true;
        } else if (diagonal[k] === 1) {
          foundPiece = true;
        }
      }
      return false;
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      //columns, first row
      var board = this.rows();
      for (var i = 0; i < board.length; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      for (var j = 1; j < board.length; j++) {
        if (this.hasMinorDiagonalConflictAt(board.length -1, j)) {
          return true;
        }
      }
      return false;
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
