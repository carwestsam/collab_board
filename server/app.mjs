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

app.use(bodyParser.json());

app.get('/', (req, res) => res.json(randomboard))
app.use('/room', room)

io.on('connection', function (socket) {
  console.log("a user conneted:", socket.id)

  socket.on('disconnect', function(){
    console.log('user disconnected:', socket.id)
  })
  socket.on('mutation', function (msg) {
    let {mutation, capsule, args, direction} = JSON.parse(msg)
    mutationDesciption[mutation]()[direction].apply(null, [capsule, randomboard, ...args])
    socket.broadcast.emit('updates', msg)
  })
})

httpServer.listen(3000, () => console.log('Example app listening on port 3000'))
// be aware, it should not be port 80, because it is belongs to a non prod account in container
