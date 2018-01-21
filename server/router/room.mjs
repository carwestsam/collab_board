import express from 'express'
import db from '../models/index'
import uuid from 'uuid/v4'
import templates from '../templates/boards/index'

const router = express.Router()
const Board = db['Board']

function Helper () {
  return {
    getRoom : async (item_id) => {
      let board = await Board.findOne({where: {item_id}})
      return board ? {content:JSON.parse(board.content), name: board.name} : board
    }
  }
}

async function saveBoard (item_id, json_content) {
  return Board.update({
    content: json_content
  }, {
    where: {item_id}
  })
}

export default {
  router,
  helper: Helper(),
  saveBoard
}

router.get('/list', async (req, res) => {
  let boards = await Board.findAll()
  return res.json({boards})
})

router.post('/create', async (req, res) => {
  let boards = []
  if (req.body) {
    let item_id = "";
    do {
      item_id = uuid()
      try {
        boards = await Board.findAll({where: {item_id}})
      } catch (e) {
        console.log('error', e)
        break
      }
    } while (boards.length != 0 )
    console.log('template object', JSON.stringify(templates))
    console.log('template name', req.body.template)
    let newBoard = {
      name: req.body.name,
      item_id,
      content: JSON.stringify(templates[req.body.template])
    }
    console.log('new board', JSON.stringify(newBoard))
    return await Board.create(newBoard).then(()=>{
      return res.status(200).json(newBoard)
    }, err => {
      return res.status(501).send('error', err)
    })
  } else {
    return res.status(200).send('invalid create post')
  }
})

router.get('/:room_id', (req, res) => {
  let item_id = req.params.room_id
  return Board.findOne({where:{item_id}})
  .then(
    result => {
      if (result) {
        res.status(200).set('Content-Type', 'application/json').send(`{"content":${result.content}, "name": "${result.name}"}`)
      } else {
        res.status(404).json({'error':'room not found'})
      }
    }, err => {
      console.log('error in get rooms', err)
      res.status(500).send('failed to find room')
  })
})

