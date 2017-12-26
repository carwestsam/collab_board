import io from 'socket.io-client'

let socketMgr

class SocketManager {
  constructor () {
    this.callback = function () {}
    this.socket = io(process.env.BACKEND_DOMAIN)
    this.socket.on('updates', (msg) => {
      this.update(JSON.parse(msg))
    })
  }

  static getInstance () {
    if (typeof socketMgr === 'undefined') {
      socketMgr = new SocketManager()
      window.socketMgr = socketMgr
    }
    return socketMgr
  }
  send (type, msg) {
    this.socket.emit(type, msg)
  }
  update (msg) {
    this.callback(msg)
  }
  onUpdate (callback) {
    this.callback = callback
  }
}

socketMgr = SocketManager.getInstance()

export default SocketManager
