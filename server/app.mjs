import express from 'express'
const app = express()
import cors  from 'cors'
import bodyParser from 'body-parser'
import socketController from './socketController'
app.use(cors())

import http from 'http'
const httpServer = http.Server(app)
import randomboard from './templates/boards/randomboard'
import Socket from 'socket.io'
import room from './router/room'
import qr from './router/qrcode'

const io = Socket(httpServer, {origins: "board.zhuoyou.cafe:* http://localhost:*"})
let BoardDict = {}
let BoardSocketDict = {}
let SocketBoardDict = {}

app.use(bodyParser.json());

app.get('/', (req, res) => res.json(randomboard))
app.get('/room/:room_id', (req, res, next) => {
  if (BoardDict[req.params.room_id]) {
    return res.json({content:BoardDict[req.params.room_id]})
  } else {
    next()
  }
})
app.use('/room', room.router)
app.use('/qr/', qr.router)

socketController(io)

var port = process.env.PORT || 3000
httpServer.listen(port, () => console.log(`Example app listening on port ${port}`))
// be aware, it should not be port 80, because it is belongs to a non prod account in container
