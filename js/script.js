var guass = guass || {};

(function (g) {
    
    'use strict';
    
    $(document).ready(function () {
        
        $('#solve').click(function () {
            g.solve();
        });
        
    });
    
    // determines if all the values in the matrix were parsed succesfully
    g.matrixParsed = true;
    
    g.solve = function () {
        g.matrix = g.parseMatrix();
        if (g.matrixParsed) {
            // gauss
            for(var row = 0, col = 0; row < g.matrix.length && col < g.matrix[row].length - 1; row++, col++) {
                g.scaleToOne(g.matrix, { "row" : row, "col" : col});
                for(var eliminate = row + 1; eliminate < g.matrix.length; eliminate++) {
                    g.scaleToOne(g.matrix, { "row" : eliminate, "col" : col});
                    g.matrix[eliminate] = g.subtractRows(g.matrix[eliminate], g.matrix[row]);
                }
            }
            g.updateTable('#gauss', g.matrix);
            // jordan
            for(var row = g.matrix.length - 1, col = g.matrix[row].length - 2; row >= 0 && col >= 0; row--, col--) {
                for(var eliminate = row - 1; eliminate >= 0; eliminate--) {
                    g.matrix[eliminate] = g.subtractRows(g.matrix[eliminate], g.multiplyRow(g.matrix[row], g.matrix[eliminate][col]));
                }
            }
            g.updateTable('#jordan', g.matrix);
        }
    };
    
    // scales row to change the value at the provided coordinate to one
    g.scaleToOne = function(matrix, coord) {
        var row = matrix[coord["row"]],
            value = matrix[coord["row"]][coord["col"]];
        if(Math.abs(value) !== 1 && value !== 0) {
            matrix[coord["row"]] = g.divideRow(row, value);
        }
    }
    
    // divides a row by a value
    g.divideRow = function(row, value) {
        var result = new Array(row.length);
        for(var i = 0; i < result.length; i++) {
            result[i] = row[i] / value; 
        }
        return result;
    }
    
    // multiplys a row by a value
    g.multiplyRow = function(row, value) {
        var result = new Array(row.length);
        for(var i = 0; i < result.length; i++) {
            result[i] = row[i] * value; 
        }
        return result;
    }
    
    // adds two rows
    g.addRows = function (row1, row2) {
        var result = new Array(row1.length);
        for(var i = 0; i < result.length; i++) {
            result[i] = row1[i] + row2[i];   
        }
        return result;
    }
    
    // subtracts two rows
    g.subtractRows = function (row1, row2) {
        var result = new Array(row1.length);
        for(var i = 0; i < result.length; i++) {
            result[i] = row1[i] - row2[i];   
        }
        return result;
    }
    
    // parses the values from each cell and returns a 2-dimensional matrix
    g.parseMatrix = function () {
        var $tableRows = $('#values').find('tr');
        var matrix = new Array($tableRows.length);
        for (var row = 0; row < matrix.length; row++) {
            matrix[row] = new Array($($tableRows[row]).children().length);
            for (var col = 0; col < matrix[row].length; col++) {
                var $cell = $('#values .r' + row + 'c' + col),
                    value = parseFloat($cell.text());
                if(isNaN(value)) {
                    $cell.addClass('danger');
                    g.matrixIsReady = false;
                }
                else {
                    $cell.removeClass('danger');
                    $cell.text(value);
                    matrix[row][col] = value;
                }
            }
        }
        g.matrixParsed = $('#values').find('.danger').length === 0;
        return matrix;
    };
    
    // updates a table with the values from a matrix
    g.updateTable = function (id, matrix) {
        for(var row = 0; row < matrix.length; row++) {
            for(var col = 0; col < matrix[row].length; col++) {
                var value = parseFloat(matrix[row][col].toFixed(5));
                $(id + ' .r' + row + 'c' + col).text(value);   
            }
        }
    };
    
    // prints a 2-dimensional matrix to the console
    g.printMatrix = function (matrix) {
      for (var row = 0; row < matrix.length; row++) {
            var str = ""
            for (var col = 0; col < matrix[row].length; col++) {
                str += matrix[row][col] + ' ';
            }
            console.log(str);
        }  
    };
    
})(guass);