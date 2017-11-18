const express = require('express')
const app = express()
const cors = require('cors')
const randomboard = require('./templates/boards/randomboard')

app.use(cors())
app.get('/', (req, res) => res.json(randomboard))

app.listen(3000, () => console.log('Example app listening on port 3000'))
