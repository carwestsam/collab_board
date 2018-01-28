import room from './router/room'
import {mutationDesciption} from '../shared_components/mutationDescription'

export let BoardDict = {}
let BoardSocketDict = {}
let SocketBoardDict = {}

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
function initialSocket(io) {
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
          BoardDict[room_id] = board.content
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
      try {
        mutationDesciption[mutation]()[direction].apply(null, [capsule, BoardDict[SocketBoardDict[socket.id]], ...args])
        socket.broadcast.to(SocketBoardDict[socket.id]).emit('updates', msg)
      } catch (e) {
        console.error('failed on execution reason', e)
      }
    })
  })
  
}

export default initialSocket