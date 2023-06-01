import express from 'express'
import moves from '../controllers/moves.js'

const router = express.Router()

router.get('/:id/:index', moves.getAvailableMoves)
router.get('/:id/play/:startIndex/:endIndex', moves.playMove)

export default router
