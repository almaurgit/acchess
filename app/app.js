import { Game } from "./Game.js"


let game = new Game()

import readline from 'readline';

function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

// while(true) {
//     try {
//         while (!game.over) {
//             const whiteMove = await askQuestion("White Move ? ");
//             game.playMove(whiteMove)
//             game.printBoard()
//             const blackMove = await askQuestion("Black Move ? ");
//             game.playMove(blackMove)
//             game.printBoard()
//         }
//     } catch(e) {
//         console.log("Bad move, please try again : ", e)
//     }
// }

game.playMove("e4")
game.printBoard()
game.playMove("e5")
game.printBoard()
game.playMove("Bc4")
game.printBoard()
game.playMove("Nf6")
game.printBoard()
game.playMove("Nf3")
game.printBoard()
game.playMove("Bc5")
game.printBoard()
game.playMove("O-O")
game.printBoard()
