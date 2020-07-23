const express = require('express')
const bodyParser = require('body-parser')
const memory = require('./memory')

const app = express()
const port = 5000

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/index.html')))
app.post('/', (req, res) => res.redirect(`/metrics/${req.body.key}`))

app.post('/metrics/:key', (req, res) => {
  memory.put(req.params.key, req.body).then(() => res.send({ success: true }))
})

app.get('/metrics/:key/sum', (req, res) => {
  memory.get(req.params.key).then((value) => res.send({ success: true, value }))
})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
