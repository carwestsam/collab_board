import express from 'express'
const app = express()
import cors  from 'cors'
app.use(cors())

import http from 'http'
const httpServer = http.Server(app)
import randomboard from './templates/boards/randomboard'
import {mutationDesciption} from '../shared_components/mutationDescription'
import Socket from 'socket.io'
const io = Socket(httpServer)

app.get('/', (req, res) => res.json(randomboard))

io.on('connection', function (socket) {
  console.log("a user conneted")
  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
  socket.on('mutation', function(msg) {
    let {mutation, capsule, args, direction} = JSON.parse(msg)
    mutationDesciption[mutation]()[direction].apply(null, [capsule, randomboard, ...args])
    socket.broadcast.emit('updates', msg)
  })
})

httpServer.listen(3000, () => console.log('Example app listening on port 3000'))
