const app = require('express')()
const cors = require('cors')
app.use(cors())

const http = require('http').Server(app);
const randomboard = require('./templates/boards/randomboard')
const io = require('socket.io')(http)

app.get('/', (req, res) => res.json(randomboard))

io.on('connection', function (socket) {
  console.log("a user conneted")
  socket.on('disconnect', function(){
    console.log('user disconnected')
  })
})

http.listen(3000, () => console.log('Example app listening on port 3000'))
