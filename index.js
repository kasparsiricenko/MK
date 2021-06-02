import { createServer } from 'http'
import express from 'express'
import { Server as SocketIoServer } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'

dotenv.config()
const port = process.env.PORT || 8765
const app = express()
const server = createServer(app)
const io = new SocketIoServer(server)

app.use(express.static('public'))

io.on('connection', (socket) => {
  console.log('Connected: ', socket)
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
})

server.listen(port, () => {
  console.log(`Started on port: ${port}`)
})
