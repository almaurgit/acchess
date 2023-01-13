import process from "process"

function squareToBoard(square) {
   if (typeof square !== 'string') {
      throw new Error("The square is not in string format")
   }
   const squareRegex = /^[a-z]\d\d?$/
   console.log(squareRegex.test(square))
   if (!squareRegex.test(square)) {
      throw new Error("The square is not in a good format (example : g2)")
   }

   const col = square[0].charCodeAt() % "a".charCodeAt()
   const row = this.dimensions - parseInt(square.slice(1))
}

console.log(true instanceof Boolean)
