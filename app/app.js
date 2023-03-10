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

// game.playMove("e4")
// game.printBoard()
// game.playMove("e5")
// game.printBoard()
// game.playMove("Bc4")
// game.printBoard()
// game.playMove("Nf6")
// game.printBoard()
// game.playMove("Nf3")
// game.printBoard()
// game.playMove("Bc5")
// game.printBoard()
// game.playMove("O-O")
// game.printBoard()
// game.playMove("Qe7")
// game.printBoard()
// game.playMove("d3")
// game.printBoard()
// game.playMove("d5")
// game.printBoard()
// game.playMove("Be3")
// game.printBoard()
// game.playMove("Bg4")
// game.printBoard()
// game.playMove("a3")
// game.printBoard()
// game.playMove("Nc6")
// game.printBoard()
// game.playMove("b4")
// game.printBoard()
// game.playMove("Rb8")
// game.printBoard()
// game.playMove("b5")
// game.printBoard()
// game.playMove("Ra8")
// game.printBoard()
// game.playMove("a4")
// game.printBoard()
// game.playMove("O-O-O")
// game.printBoard()

// game.playMove("e4")
// game.printBoard()
// game.playMove("a6")
// game.printBoard()
// game.playMove("e5")
// game.printBoard()
// game.playMove("d5")
// game.printBoard()
// game.playMove("exd6")
// game.printBoard()
// game.playMove("d4")
// game.printBoard()
// game.playMove("c4")
// game.printBoard()
// game.playMove("dxc3")
// game.printBoard()
// game.playMove("g4")
// game.printBoard()
// game.playMove("Ra7")
// game.printBoard()
// game.playMove("g5")
// game.printBoard()
// game.playMove("f5")
// game.printBoard()
// game.playMove("a3")
// game.printBoard()
// game.playMove("h5")
// game.printBoard()
// game.playMove("exh6")
// game.printBoard()


// game.playMove("d4")
// game.printBoard()
// game.playMove("a6")
// game.printBoard()
// game.playMove("d5")
// game.printBoard()
// game.playMove("a5")
// game.printBoard()
// game.playMove("d6")
// game.printBoard()
// game.playMove("exd6")
// game.printBoard()
// game.playMove("e4")
// game.printBoard()
// game.playMove("a4")
// game.printBoard()
// game.playMove("e5")
// game.printBoard()
// game.playMove("a3")
// game.printBoard()
// game.playMove("Qe2")
// game.printBoard()
// game.playMove("f5")
// game.printBoard()
// game.playMove("exf6")
// game.printBoard()
// game.playMove("axb2")
// game.printBoard()


// game.playMove("a4")
// game.printBoard()
// game.playMove("h5")
// game.printBoard()
// game.playMove("a5")
// game.printBoard()
// game.playMove("h4")
// game.printBoard()
// game.playMove("a6")
// game.printBoard()
// game.playMove("h3")
// game.printBoard()
// game.playMove("axb7")
// game.printBoard()
// game.playMove("hxg2")
// game.printBoard()
// game.playMove("bxa8=Q")
// game.printBoard()
// game.playMove("gxh1=N")
// game.printBoard()
// game.playMove("axb2")
// game.printBoard()
// game.playMove("axb2")
// game.printBoard()
// game.playMove("axb2")
// game.printBoard()
// game.playMove("axb2")
// game.printBoard()


game.importPgn(`1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 4. Ba4 Nf6 5. O-O Be7 6. Re1 b5 7. Bb3 d6 8. c3
O-O 9. h3 Nb8 10. d4 Nbd7 11. c4 c6 12. cxb5 axb5 13. Nc3 Bb7 14. Bg5 b4 15.
Nb1 h6 16. Bh4 c5 17. dxe5 Nxe4 18. Bxe7 Qxe7 19. exd6 Qf6 20. Nbd2 Nxd6 21.
Nc4 Nxc4 22. Bxc4 Nb6 23. Ne5 Rae8 24. Bxf7+ Rxf7 25. Nxf7 Rxe1+ 26. Qxe1 Kxf7
27. Qe3 Qg5 28. Qxg5 hxg5 29. b3 Ke6 30. a3 Kd6 31. axb4 cxb4 32. Ra5 Nd5 33.
f3 Bc8 34. Kf2 Bf5 35. Ra7 g6 36. Ra6+ Kc5 37. Ke1 Nf4 38. g3 Nxh3 39. Kd2 Kb5
40. Rd6 Kc5 41. Ra6 Nf2 42. g4 Bd3 43. Re6`)