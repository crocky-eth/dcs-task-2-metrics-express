const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const memory = require('./memory')

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/index.html')))
app.post('/', (req, res) => res.redirect(`/metrics/${req.body.key}`))

app.get('/metrics/:key', (req, res) => res.sendFile(path.join(__dirname + '/public/metrics.html')))
app.post('/metrics/:key', (req, res) => {
  const { redirect, value } = req.body
  memory.put(req.params.key, { value: Number(value) }).then(() => {
    redirect ? res.redirect(`/metrics/${req.params.key}`) : res.send({ success: true })
  })
})

app.get('/metrics/:key/sum', (req, res) => {
  memory.get(req.params.key).then((value) => res.send({ success: true, value }))
})
app.get('/metrics/:key/all', (req, res) => {
  memory.getAll(req.params.key).then((value) => res.send({ success: true, value }))
})

app.get('*', (req, res) => res.redirect('/'))

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
