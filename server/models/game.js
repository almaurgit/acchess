import mongoose from 'mongoose'

const gameSchema = mongoose.Schema({
    pgn: {type: String, required: true},
    whitePlayer: {type: String, required: true},
    blackPlayer: {type: String, required: true},
    whiteTime: {type: Array, required: false},
    blackTime: {type: Array, required: false},
    game: {type: Array, required: false},
    ending: {type: String, required: true},
    result: {type: String, required: true},
    numberOfMoves: {type: Number, required: true}
})

export default mongoose.model("Game", gameSchema)