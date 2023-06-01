import express from 'express'
import play from '../controllers/play.js'

const router = express.Router()

router.post('/create', play.createGame)
router.post('/join/:id', play.joinGame)
router.post('/custom/create', play.createCustomGame)
router.get('/chessboard/:id', play.getChessboard)
router.get('/gamesettings/:id', play.getGameSettings)
router.get('/analysis/:id', play.getFullGame)

export default router
