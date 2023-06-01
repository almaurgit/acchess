import { Piece } from './Piece.mjs'

export function accessibleSquaresLine() {
  let squares = []
  const pinned = this.isPiecePinned()
  if (pinned.pinned && pinned.direction !== 'row' && pinned.direction !== 'col')
    return squares
  let row = this.row + 1
  let col = this.col
  while (row < this.game.dimensions) {
    if (pinned.pinned && pinned.direction !== 'col') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      row++
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    row++
  }
  row = this.row - 1
  col = this.col
  while (row >= 0) {
    if (pinned.pinned && pinned.direction !== 'col') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      row--
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    row--
  }
  row = this.row
  col = this.col + 1
  while (col < this.game.dimensions) {
    if (pinned.pinned && pinned.direction !== 'row') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col++
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col++
  }
  row = this.row
  col = this.col - 1
  while (col >= 0) {
    if (pinned.pinned && pinned.direction !== 'row') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col--
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col--
  }
  return squares
}

export function accessibleSquaresDiagonal() {
  let squares = []
  const pinned = this.isPiecePinned()
  if (
    pinned.pinned &&
    pinned.direction !== 'diagonalUp' &&
    pinned.direction !== 'diagonalDown'
  )
    return squares
  let row = this.row + 1
  let col = this.col + 1
  while (row < this.game.dimensions && col < this.game.dimensions) {
    if (pinned.pinned && pinned.direction !== 'diagonalDown') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col++
      row++
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col++
    row++
  }
  row = this.row - 1
  col = this.col + 1
  while (row >= 0 && col < this.game.dimensions) {
    if (pinned.pinned && pinned.direction !== 'diagonalUp') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col++
      row--
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col++
    row--
  }
  row = this.row + 1
  col = this.col - 1
  while (row < this.game.dimensions && col >= 0) {
    if (pinned.pinned && pinned.direction !== 'diagonalUp') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col--
      row++
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col--
    row++
  }
  row = this.row - 1
  col = this.col - 1
  while (row >= 0 && col >= 0) {
    if (pinned.pinned && pinned.direction !== 'diagonalDown') break
    if (!this.mustBlockCheck(row, col)) {
      if (this.game.chessboard[row][col] instanceof Piece) break
      col--
      row--
      continue
    }
    if (this.game.chessboard[row][col] === null) {
      squares.push({
        row: row,
        col: col,
        capture: false,
      })
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color !== this.color
    ) {
      squares.push({
        row: row,
        col: col,
        capture: true,
      })
      break
    } else if (
      this.game.chessboard[row][col] instanceof Piece &&
      this.game.chessboard[row][col].color === this.color
    )
      break
    col--
    row--
  }
  return squares
}

export function canAccessLine(endRow, endCol, capture, forKingSquares) {
  if (!forKingSquares) {
    const pinned = this.isPiecePinned()
    if (pinned.pinned) {
      if (!pinned.direction) return false
      if (endRow === this.row && pinned.direction !== 'row') return false
      if (endCol === this.col && pinned.direction !== 'col') return false
    }
    if (!this.mustBlockCheck(endRow, endCol)) return false
  }
  if (endRow === this.row && endCol === this.col) return false // we don't want to allow to make a move to the same square

  if (endRow !== this.row && endCol !== this.col) return false
  if (endRow === this.row) {
    if (this.col > endCol) {
      for (let i = this.col - 1; i > endCol; i--) {
        if (this.game.chessboard[this.row][i] !== null) return false
      }
    } else {
      for (let i = this.col + 1; i < endCol; i++) {
        if (this.game.chessboard[this.row][i] !== null) return false
      }
    }
  } else {
    if (this.row > endRow) {
      for (let i = this.row - 1; i > endRow; i--) {
        if (this.game.chessboard[i][this.col] !== null) return false
      }
    } else {
      for (let i = this.row + 1; i < endRow; i++) {
        if (this.game.chessboard[i][this.col] !== null) return false
      }
    }
  }
  return true
}

export function canAccessDiagonal(endRow, endCol, capture, forKingSquares) {
  if (!forKingSquares) {
    const pinned = this.isPiecePinned()
    if (pinned.pinned) {
      if (!pinned.direction) return false
      if (
        ((endRow < this.row && endCol < this.col) ||
          (endRow > this.row && endCol > this.col)) &&
        pinned.direction !== 'diagonalDown'
      )
        return false
      if (
        ((endRow > this.row && endCol < this.col) ||
          (endRow < this.row && endCol > this.col)) &&
        pinned.direction !== 'diagonalUp'
      )
        return false
    }
    if (!this.mustBlockCheck(endRow, endCol)) return false
  }
  if (this.row === endRow && this.col === endCol) return false
  if (Math.abs(endRow - this.row) !== Math.abs(endCol - this.col)) return false
  else {
    let minCol = Math.min(endCol, this.col)
    let minRow = Math.min(endRow, this.row)
    let maxCol = Math.max(endCol, this.col)
    let maxRow = Math.max(endRow, this.row)
    if (
      (minCol === this.col && minRow === this.row) ||
      (maxCol === this.col && maxRow === this.row)
    ) {
      let col = minCol + 1
      let row = minRow + 1
      while (col < maxCol && row < maxRow) {
        if (this.game.chessboard[row][col] !== null) return false
        row++
        col++
      }
    } else {
      let col = maxCol - 1
      let row = minRow + 1
      while (col > minCol && row < maxRow) {
        if (this.game.chessboard[row][col] !== null) {
          return false
        }
        row++
        col--
      }
    }
  }
  return true
}
