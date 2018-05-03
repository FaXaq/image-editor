const express = require('express')
const app = express()
const routes = require('./routes/index')
const bodyParser = require('body-parser')

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

/* status */
app.use('/', express.static('public'))

app.use('/api/v1', routes)

app.listen(3000, () => {
  console.log('Listening on 3000')
})
