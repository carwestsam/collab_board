import QRCode from 'qrcode'
import express from 'express'

const router = express.Router()

export default {
  router
}

router.get('/', (req, res) => {
  let qr = new Promise((resolve, reject)=>{
    let text = req.query.url || 'Parameter Error'
    QRCode.toDataURL(text, {version: 5}, function (err, url) {
      if (err) reject(err)
      else resolve(url)
    })
  })
  return qr.then((url) => {
    res.status(200).set('Content-Type', 'image/png').send(url)
  }, e => {
    res.status(500).send('error' + e)
  })
})
