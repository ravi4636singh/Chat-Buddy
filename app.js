const express = require('express')
const http = require('http')
const path = require('path')
const { Server } = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static(path.join(__dirname, '/public/')))

app.get('/', (req, res) => {
    res.sendFile('index.html')
})

io.on('connection', (socket) => {
    socket.on('new message', (msgInfo) => {
        socket.broadcast.emit('new message', msgInfo)
    })

    socket.on('join user', (uname) => {
        socket.broadcast.emit('connected', uname)
    })

    socket.on('exit user', (uname) => {
        socket.broadcast.emit('disconnected', uname)
    })
})

server.listen(5000, () => {
    console.log('http://localhost:5000')
})