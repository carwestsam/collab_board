import SocketManager from './SocketManager'
let socketMgr = SocketManager.getInstance()

let shm
export class StateHistoryMgr {
  constructor () {
    this.history = []
    this.origin = {}
    this.historyPt = 0 // next position
    this.state = undefined
  }
  static getInstance () {
    if (typeof shm === 'undefined') {
      shm = new StateHistoryMgr()
      socketMgr.onUpdate(function (msg) { shm.update(msg) })
      window.shm = shm
    }
    return shm
  }
  setState (state) {
    this.state = state
  }

  addRawMutation (origin, key, raw) {
    let $this = this
    this.origin[key] = raw

    origin.mutations[key] = function () {
      let capsule = {}
      let args = [...arguments].slice(1)
      shm.append(key, args, capsule)
      raw().forward.apply(null, [capsule, $this.state, ...args])
      socketMgr.send('mutation', JSON.stringify({
        mutation: key,
        args,
        capsule,
        direction: 'forward'
      }))
    }
  }

  update (msg) {
    let {mutation, args, capsule, direction} = msg
    this.origin[mutation]()[direction].apply(null, [capsule, this.state, ...args])

    if (direction === 'forward') {
      shm.append(mutation, args, capsule)
    }
  }

  append (key, args, capsule) {
    if (this.history.length > 0 && this.history.length > this.historyPt) {
      this.history = this.history.slice(0, this.historyPt)
    }
    this.history.push({
      mutation: key,
      args,
      capsule
    })
    this.historyPt += 1
  }

  emptyHistoryPointer () {
    this.historyPt = 0
    this.history = []
    this.origin = {}
    console.log('empty')
  }

  resetHistoryPointer () {
  }

  undo () {
    if (this.historyPt === 0) {
      return
    }

    let {mutation, args, capsule} = this.history[this.historyPt - 1]
    this.origin[mutation]().backward.apply(null, [capsule, this.state, ...args])
    socketMgr.send('mutation', JSON.stringify({
      mutation,
      args,
      capsule,
      direction: 'backward'
    }))
    this.historyPt -= 1
  }

  redo () {
    if (this.historyPt === this.history.length) {
      return
    }
    let {mutation, args, capsule} = this.history[this.historyPt]

    this.origin[mutation]().forward.apply(null, [capsule, this.state, ...args])
    socketMgr.send('mutation', JSON.stringify({
      mutation,
      args,
      capsule,
      direction: 'forward'
    }))

    this.historyPt += 1
  }
}
shm = StateHistoryMgr.getInstance()
export class VuexConfigGenerator {
  // origin = {}
  constructor (origin) {
    this.origin = origin
  }
  attachMutations (attachObject) {
    for (let key in attachObject) {
      let shm = StateHistoryMgr.getInstance()
      let func = attachObject[key]
      shm.addRawMutation(this.origin, key, func)
    }
  }
}
