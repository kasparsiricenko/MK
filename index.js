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

const matches = []
io.on('connection', (socket) => {
  socket.on('create', ({ name, character } = {}) => {
    if (typeof name === 'string' && name.length > 0 && name.length < 16) {
      const created = new Date()
      const createdIdNumber = Number(
        created.getHours() + '' + created.getMinutes()
      )
      const createdIdHex =
        (createdIdNumber <= 255 ? '0' : '') + createdIdNumber.toString(16)
      const match = {
        id: (uuidv4().slice(0, 3) + createdIdHex).toUpperCase(),
        state: 'created',
        player: {
          id: uuidv4(),
          name,
          character: characters.includes(character) && character,
          socket,
        },
        created,
        updated: created,
      }
      if (matches.length < 20) {
        matches.push(match)
        return socket.emit('created', {
          ok: true,
          createdMatch: { id: match.id },
        })
      }

      if (!match.character) {
        return socket.emit('created', { error: '0x01' })
      }
    } else {
      return socket.emit('created', { error: '0x00' })
    }
  })
  socket.on('join', ({ match, player } = {}) => {
    if (match && typeof match.id === 'string' && match.id.length === 6) {
      if (
        player &&
        typeof player.name === 'string' &&
        player.name.length > 0 &&
        player.name.length < 16
      ) {
        if (player.character && characters.includes(player.character)) {
          const matchId = match.id.toUpperCase()
          const foundMatchIndex = matches.findIndex(
            (match2) => match2.id === matchId
          )
          if (foundMatchIndex < 0) {
            return socket.emit('joined', {
              error: 'Match not found. Please check you passcode',
            })
          }
          const foundMatch = matches[foundMatchIndex]
          if (foundMatch.hasOwnProperty('opponent')) {
            return socket.emit('joined', {
              error: 'Match has been already started',
            })
          }
          matches[foundMatchIndex] = {
            ...foundMatch,
            opponent: {
              id: uuidv4(),
              name: player.name,
              character: player.character,
              socket,
            },
            updated: new Date(),
            state: 'playing',
          }
          socket.emit('joined', {
            ok: true,
            enemyPlayer: {
              name: foundMatch.player.name,
              character: foundMatch.player.character,
            },
          })
          foundMatch.player.socket.emit('opponentJoined', {
            ok: true,
            enemyPlayer: player,
          })
        } else {
          return socket.emit('joined', { error: '0x05' })
        }
      } else {
        return socket.emit('joined', { error: '0x04' })
      }
    } else {
      return socket.emit('joined', {
        error: 'Bad match passcode. Please check it.',
      })
    }
  })
})

server.listen(port, () => {
  console.log(`Started on port: ${port}`)
})

const uuidv4 = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8 //eslint-disable-line
    return v.toString(16)
  })

const characters = ['scorpion', 'kitana']
