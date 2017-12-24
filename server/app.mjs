import express from 'express'
const app = express()
import cors  from 'cors'
import bodyParser from 'body-parser'
app.use(cors())

import http from 'http'
const httpServer = http.Server(app)
import randomboard from './templates/boards/randomboard'
import board_template from './templates/boards/board_template'
import {mutationDesciption} from '../shared_components/mutationDescription'
import Socket from 'socket.io'
import room from './router/room'

const io = Socket(httpServer)
let BoardDict = {}
let BoardSocketDict = {}
let SocketBoardDict = {}

app.use(bodyParser.json());

app.get('/', (req, res) => res.json(randomboard))
app.get('/room/:room_id', (req, res, next) => {
  if (BoardDict[req.params.room_id]) {
    return res.json(BoardDict[req.params.room_id])
  } else {
    next()
  }
})
app.use('/room', room.router)

function leaveRoom (room_id, socket_id) {
  if ( !BoardSocketDict[room_id] ) {
    return
  }
  BoardSocketDict[room_id] = BoardSocketDict[room_id].filter(x => x != socket_id)
  if (BoardSocketDict[room_id].length == 0) {
    room.saveBoard(room_id, JSON.stringify(BoardDict[room_id]))
    delete SocketBoardDict[socket_id]
    delete BoardSocketDict[room_id]
    delete BoardDict[room_id]
  }
}

io.on('connection', function (socket) {
  console.log("a user conneted:", socket.id)

  socket.on('disconnect', function(){
    console.log('user disconnected:', socket.id)
    leaveRoom(SocketBoardDict[socket.id], socket.id)
  })

  socket.on('join-room', async function (msg) {
    let {room_id} = JSON.parse(msg)
    console.log(`user ${socket.id} want to join ${room_id}`)

    try {

    if (BoardDict[room_id]){
      // socket.join(room_id)
      if (SocketBoardDict[socket.id]){
        let oldRoom = SocketBoardDict[socket.id]
        if (room_id == oldRoom) {
          return
        }

        leaveRoom(oldRoom, socket.id)
      }
      SocketBoardDict[socket.id] = room_id
      if (!BoardSocketDict[room_id]) {
        BoardSocketDict[room_id] = []
      }
      BoardSocketDict[room_id].push(socket.id)
      socket.join(room_id)
    } else {
      let board = await room.helper.getRoom(room_id)
      if (board) {
        BoardDict[room_id] = board
        BoardSocketDict[room_id] = [socket.id]
        SocketBoardDict[socket.id] = room_id
        socket.join(room_id)
        // console.log('boarddict', JSON.stringify(BoardDict))
        // console.log('BoardSocketDict', JSON.stringify(BoardSocketDict))
        // console.log('SocketBoardDict', JSON.stringify(SocketBoardDict))
        console.log(`user ${socket.id} joind board ${room_id}`)
      } else {
        socket.emit('error', 'room not exsit')
      }
    }} catch (e) {
      console.log('join room error', e)
    }
  })

  socket.on('save', function() {
    if (SocketBoardDict[socket.id]){
      let room_id = SocketBoardDict[socket.id]
      room.saveBoard(room_id, JSON.stringify(BoardDict[room_id]))
    }
  })

  socket.on('mutation', function (msg) {
    let {mutation, capsule, args, direction} = JSON.parse(msg)
    // console.log('msg:', msg)
    // console.log('socket.id:', socket.id)
    // console.log('socketboarddict', SocketBoardDict[socket.id])
    mutationDesciption[mutation]()[direction].apply(null, [capsule, BoardDict[SocketBoardDict[socket.id]], ...args])
    socket.broadcast.to(SocketBoardDict[socket.id]).emit('updates', msg)
  })
})

httpServer.listen(3000, () => console.log('Example app listening on port 3000'))
// be aware, it should not be port 80, because it is belongs to a non prod account in container
