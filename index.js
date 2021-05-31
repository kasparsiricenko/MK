import { createServer } from 'http'
import express from 'express'
import { Server as SocketIoServer } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const port = process.env.PORT
const app = express()
const server = createServer(app)
const io = new SocketIoServer(server)

const publicPath = path.join(__dirname, './public')
app.use(express.static(publicPath))

io.on('connection', (socket) => {
  console.log('Connected: ', socket)
  socket.on('disconnect', () => {
    console.log('Disconnected')
  })
})

server.listen(port, () => {
  console.log(`Started on port: ${port}`)
})
