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
