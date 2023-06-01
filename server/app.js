import express from 'express'
// import mongoose from 'mongoose'
import movesRouter from './routes/moves.js'
import gameRouter from './routes/play.js'
import cookieParser from 'cookie-parser'

const app = express()

// mongoose
//   .connect(
//     'mongodb+srv://acchess:Gm4XH7I9d54Lo5n0@cluster0.6p60g5i.mongodb.net/?retryWrites=true&w=majority',
//     {
//       useNewUrlparser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => console.log('Connexion à MongoDB réussie !'))
//   .catch(() => console.log('Connexion à MongoDB échouée !'))

app.use(express.json())

app.use(cookieParser())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://acchess.org')
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  )
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS'
  )
  next()
})

app.use('/play', gameRouter)
app.use('/moves', movesRouter)

export default app
