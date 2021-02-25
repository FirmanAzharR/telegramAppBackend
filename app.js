const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()

//socket.io
const socket = require('socket.io')

const routesNavigation = require('./src/routesNavigation')

const app = express()
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', '*')
  // response.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5000/')
  response.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Request-With, Content-Type, Authorization'
  )
  next()
})
app.use(express.static('uploads'))

app.use('/', routesNavigation)
app.get('*', (req, res) => {
  res.status(404).send('Path not found')
})

const http = require('http')
const server = http.createServer(app)
const io = socket(server, {
  cors: {
    origin: '*'
  }
})

io.on('connection', (socket) => {
  console.log('Socket.io Connect')

  socket.on('joinRoom', (data) => {
    console.log(data)
    socket.join(data.key_room)
  })

  socket.on('roomMsg', (data) => {
    console.log(data)
    io.to(data.key_room).emit('chatMsg', data)
  })
})

server.listen(process.env.PORT, '0.0.0.0', () => {
  console.log(`Listening on port ${process.env.PORT}`)
})
