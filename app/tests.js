import {Game} from "./Game.js"

let game = new Game()

game.printBoard()

//Valid moves
console.log(game.parseMove("a1"))
console.log(game.parseMove("a2"))
console.log(game.parseMove("a7"))
console.log(game.parseMove("a8"))
console.log(game.parseMove("b1"))
console.log(game.parseMove("b8"))
console.log(game.parseMove("c5"))
console.log(game.parseMove("h1"))
console.log(game.parseMove("h8"))
console.log(game.parseMove("Ra2"))
console.log(game.parseMove("Ra3"))
console.log(game.parseMove("Qa4"))
console.log(game.parseMove("Ke3"))
console.log(game.parseMove("Ne4"))
console.log(game.parseMove("Rab1"))
console.log(game.parseMove("Rhb1"))
console.log(game.parseMove("Ra1b1"))
console.log(game.parseMove("Rxb2"))
console.log(game.parseMove("Qxb3"))