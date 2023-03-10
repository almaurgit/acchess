// import {Game} from "./Game.js"

// let game = new Game()

// game.printBoard()

// //Valid moves
// console.log(game.parseMove("a1"))
// console.log(game.parseMove("a2"))
// console.log(game.parseMove("a7"))
// console.log(game.parseMove("a8"))
// console.log(game.parseMove("b1"))
// console.log(game.parseMove("b8"))
// console.log(game.parseMove("c5"))
// console.log(game.parseMove("h1"))
// console.log(game.parseMove("h8"))
// console.log(game.parseMove("Ra2"))
// console.log(game.parseMove("Ra3"))
// console.log(game.parseMove("Qa4"))
// console.log(game.parseMove("Ke3"))
// console.log(game.parseMove("Ne4"))
// console.log(game.parseMove("Rab1"))
// console.log(game.parseMove("Rhb1"))
// console.log(game.parseMove("Ra1b1"))
// console.log(game.parseMove("Rxb2"))
// console.log(game.parseMove("Qxb3"))

// function findChessboard(chessboard, cb) {
//     let ret = null
//     for (let row of chessboard) {
//         for (let piece of row) {
//             if (cb(piece) === true) return piece
//         }
//     }
// }

// let test = n => {
//     if (n % 3 === 0) return true
// }

// let number = findChessboard([[1,2,4],[2,2,5],[12,9,4],[3,2,1]], test)

// console.log(number)

// function func1() {return false}
// function func2() {return true}
// let func = (func1 || func2)

// console.log(func())


let a = [1, 2, [1,2], [1,2,3], 4, 5]
console.log(a.flat())
console.log(a)