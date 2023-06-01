export function validCoordinate(coordinate) {
  if (typeof coordinate !== 'string') {
    throw new Error('The square is not in string format')
  }
  const squareRegex = /^[a-z]\d\d?$/
  if (!squareRegex.test(coordinate)) {
    throw new Error('The square is not in a good format (example : g2)')
  }

  return true
}

export function validColor(color) {
  return color === 'white' || color === 'black'
}

export function filterChessboard(chessboard, cb) {
  let filtered = []
  chessboard.forEach((row) => {
    for (let square of row) {
      if (cb(square) === true) filtered.push(square)
    }
  })
  return filtered
}

export function forEachChessboard(chessboard, cb) {
  chessboard.forEach((row) => {
    for (let square of row) {
      cb(square)
    }
  })
}

export function findChessboard(chessboard, cb) {
  for (let row of chessboard) {
    for (let piece of row) {
      if (cb(piece) === true) return piece
    }
  }
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
