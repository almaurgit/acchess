export function accessibleSquaresLine() {
    let squares = []
    let row = this.row + 1
    let col = this.col
    while (row < this.game.dimensions) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        row++
    }
    row = this.row - 1
    col = this.col
    while (row > 0) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        row--
    }
    row = this.row
    col = this.col + 1
    while (col < this.game.dimensions) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col++
    }
    row = this.row
    col = this.col - 1
    while (col > 0) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col--
    }
    return squares
}

// accessibleSquares() { // modifier pour ne pas autoriser les sauts (rajouter des boucles)
//     squares = []
//     for (let col = 0; col < this.game.dimensions; col++)
//     {
//         if (col === this.col) continue
//         if (this.game.chessboard[this.row][col] === null) {
//             squares.add({
//                 row: this.row,
//                 col: col,
//                 capture: false
//             })
//         }
//         else if (this.game.chessboard[this.row][col] instanceof Piece && this.game.chessboard[this.row][col].color !== this.color) {
//             squares.add({
//                 row: this.row,
//                 col: col,
//                 capture: true
//             })
//         }
//     }
//     for (let row = 0; row < this.game.dimensions; row++)
//     {
//         if (row === this.row) continue
//         if (this.game.chessboard[row][this.col] === null) {
//             squares.add({
//                 row: row,
//                 col: this.col,
//                 capture: false
//             })
//         }
//         else if (this.game.chessboard[row][this.col] instanceof Piece && this.game.chessboard[row][this.col].color !== this.color) {
//             squares.add({
//                 row: row,
//                 col: this.col,
//                 capture: true
//             })
//         }
//     }
//     return squares
// }

export function accessibleSquaresDiagonal() {
    let squares = []
    let row = this.row + 1
    let col = this.col + 1
    while (row < this.game.dimensions && col < this.game.dimensions) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col++
        row++
    }
    row = this.row - 1
    col = this.col + 1
    while (row > 0 && col < this.game.dimensions) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col++
        row--
    }
    row = this.row + 1
    col = this.col - 1
    while (row < this.game.dimensions && col > 0) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col--
        row++
    }
    row = this.row - 1
    col = this.col - 1
    while (row > 0 && col > 0) {
        if (this.game.chessboard[row][col] === null) {
            squares.push({
                row: row,
                col: col,
                capture: false
            })
        }
        else if (this.game.chessboard[row][col] instanceof Piece && this.game.chessboard[row][col].color !== this.color) {
            squares.push({
                row: row,
                col: col,
                capture: true
            })
            break
        }
        col--
        row--
    }
    return squares
}

export function canAccessLine(endRow, endCol) {
    if (endRow === this.row && endCol === this.col) return false // we don't want to allow to make a move to the same square

    // specific rules for the rook (move verticaly and horizontally)
    if (endRow !== this.row && endCol !== this.col) return false
    if (endRow === this.row) {
        if (this.col > endCol) {
            for (let i = this.col - 1; i > endCol; i--) {
                if (this.game.chessboard[this.row][i] !== null) return false
            }
        }
        else {
            for (let i = this.col + 1; i < endCol; i++) {
                if (this.game.chessboard[this.row][i] !== null) return false
            }
        }
    }
    else {
        if (this.row > endRow) {
            for (let i = this.row - 1; i > endRow; i--) {
                if (this.game.chessboard[i][this.col] !== null) return false
            }
        }
        else {
            for (let i = this.row + 1; i < endRow; i++) {
                if (this.game.chessboard[i][this.col] !== null) return false
            }
        }
    }
    return true
}

export function canAccessDiagonal(endRow, endCol, capture) {
    console.log("diagonal access", this.col, this.row)
    if (this.row === endRow && this.col === endCol) return false
    if (Math.abs(endRow - this.row) !== Math.abs(endCol - this.col)) 
        return false
    else {
        let minCol = Math.min(endCol, this.col)
        let minRow = Math.min(endRow, this.row)
        let maxCol = Math.max(endCol, this.col)
        let maxRow = Math.max(endRow, this.row)
        if ((minCol === this.col && minRow === this.row) || (maxCol === this.col && maxRow === this.row)) {
            let col = minCol + 1
            let row = minRow + 1
            while (col < maxCol && row < maxRow) {
                console.log("====== ENDCOL > THIS.COL =======", this.row, row, endRow, "=====", this.col, col, endCol)
                if (this.game.chessboard[row][col] !== null) return false
                row++
                col++
            }
        }
        else {
            let col = maxCol - 1
            let row = minRow + 1
            while (col > minCol && row < maxRow) {
                console.log("======ENDCOL < THIS.COL ======= ", this.row, row, endRow, "=====", this.col, col, endCol)
                    if (this.game.chessboard[row][col] !== null) {
                    console.log("======ENDCOL < THIS.COL ======= FALSE", this.row, row, endRow, "=====", this.col, col, endCol)
                    console.log(this.game.chessboard[row][col].position)
                    return false
                }
                row++
                col--
            }
        }
    }
    return true
}