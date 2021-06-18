import { createServer } from 'http'
import express from 'express'
import { Server as SocketIoServer } from 'socket.io'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()
const port = process.env.PORT || 8765
const app = express()
const server = createServer(app)
const io = new SocketIoServer(server)

app.use(express.static('public'))
const matches = []
const matchesMax = 20
io.on('connection', (socket) => {
  const player = { state: 'menu' }
  socket.on('create', ({ name, character } = {}) => {
    if (player.state !== 'menu') {
      socket.emit('created', { error: '0x07' })
      socket.disconnect()
    }
    if (typeof name === 'string' && name.length > 0 && name.length < 16) {
      if (!characters.includes(character)) {
        return socket.emit('created', { error: '0x06' })
      }
      if (matches.length < matchesMax) {
        const created = new Date()
        const createdIdNumber = Number(
          created.getHours() + '' + created.getMinutes()
        )
        const createdIdHex =
          (createdIdNumber <= 255 ? '0' : '') + createdIdNumber.toString(16)

        player.id = uuidv4()
        player.name = name
        player.character = character
        player.socket = socket
        player.state = 'created'

        const match = {
          id: (uuidv4().slice(0, 3) + createdIdHex).toUpperCase(),
          state: 'created',
          player,
          created,
          updated: created,
        }
        player.match = match
        matches.push(match)
        return socket.emit('created', {
          ok: true,
          createdMatch: { id: match.id },
        })
      } else {
        socket.emit('created', { error: 'Server is busy. Please come again' })
        return socket.disconnect()
      }

      if (!match.character) {
        return socket.emit('created', { error: '0x01' })
      }
    } else {
      return socket.emit('created', { error: '0x00' })
    }
  })
  socket.on('join', ({ match, player: joinPlayer } = {}) => {
    if (player.state !== 'menu') {
      socket.emit('joined', { error: '0x08' })
      socket.disconnect()
    }
    if (match && typeof match.id === 'string' && match.id.length === 6) {
      if (
        joinPlayer &&
        typeof joinPlayer.name === 'string' &&
        joinPlayer.name.length > 0 &&
        joinPlayer.name.length < 16
      ) {
        if (joinPlayer.character && characters.includes(joinPlayer.character)) {
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

          player.id = uuidv4()
          player.name = joinPlayer.name
          player.character = joinPlayer.character
          player.socket = socket
          player.state = 'playing'

          foundMatch.opponent = player
          foundMatch.updated = new Date()
          foundMatch.state = 'playing'
          foundMatch.current = 0
          foundMatch.actions = []
          foundMatch.player.state = 'playing'
          foundMatch.player.hp = 100
          foundMatch.opponent.hp = 100
          foundMatch.time = 30000
          foundMatch.update = () => {
            foundMatch.updated = new Date()
            if (!foundMatch.actions[foundMatch.current]) {
              foundMatch.actions[foundMatch.current] = {}
            }
            const action = foundMatch.actions[foundMatch.current]
            const player1 = foundMatch.player
            const player2 = foundMatch.opponent
            const action1 = action[player1.id]
            const action2 = action[player2.id]
            const action1DefenceSuccess =
              !action2 || (!!action1 && action2.attack === action1.defence)
            const action2DefenceSuccess =
              !action1 || (!!action2 && action1.attack === action2.defence)

            if (action1DefenceSuccess === false) {
              action2.value = getRandomizedHit(damages[action2.attack])
              const newHP = player1.hp - action2.value
              player1.hp = newHP < 0 ? 0 : newHP
            }

            if (action2DefenceSuccess === false) {
              action1.value = getRandomizedHit(damages[action1.attack])
              const newHP = player2.hp - action1.value
              player2.hp = newHP < 0 ? 0 : newHP
            }

            const action1Result = {
              ...action1,
              hasAction: !!action1,
              defenceSuccess: action1DefenceSuccess,
              hp: player1.hp,
            }

            const action2Result = {
              ...action2,
              hasAction: !!action2,
              defenceSuccess: action2DefenceSuccess,
              hp: player2.hp,
            }

            const finished = action1Result.hp === 0 || action2Result.hp === 0

            player1.socket.emit('actionResult', {
              ok: true,
              playerAction: action1Result,
              enemyAction: action2Result,
            })

            player2.socket.emit('actionResult', {
              ok: true,
              playerAction: action2Result,
              enemyAction: action1Result,
            })

            if (finished) {
              player1.socket.emit('finish', {
                ok: true,
                history: foundMatch.actions,
              })
              player2.socket.emit('finish', {
                ok: true,
                history: foundMatch.actions,
              })
              clearTimeout(foundMatch.timer)
            } else {
              foundMatch.current++
              foundMatch.timer = setTimeout(foundMatch.update, foundMatch.time)
            }
          }
          foundMatch.timer = setTimeout(foundMatch.update, foundMatch.time)
          player.match = matches[foundMatchIndex]
          socket.emit('joined', {
            ok: true,
            enemyPlayer: {
              name: foundMatch.player.name,
              character: foundMatch.player.character,
            },
            timeout: foundMatch.time,
          })

          foundMatch.player.socket.emit('opponentJoined', {
            ok: true,
            enemyPlayer: {
              name: player.name,
              character: player.character,
            },
            timeout: foundMatch.time,
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
  socket.on('action', ({ action } = {}) => {
    if (player.state !== 'playing') {
      socket.emit('actionAcknowledged', { error: '0x09' })
      console.error(
        `unexpected socket action event in state "${player.state}"`,
        player
      )
      return socket.disconnect()
    }
    if (!matches.find((match2) => match2.id === player.match.id)) {
      socket.emit('actionAcknowledged', { error: '0x10' })
      console.error(
        'unexpected socket action event on unknown match',
        JSON.stringify({ action, player })
      )
      return socket.disconnect()
    }

    if (!player.match.actions[player.match.current]) {
      player.match.actions[player.match.current] = {}
    }

    if (player.match.actions[player.match.current][player.id]) {
      socket.emit('actionAcknowledged', { error: '0x11' })
      console.error(
        'unexpected socket action event on multiple action',
        JSON.stringify({ action, player })
      )
      return socket.disconnect()
    }
    if (player.match.state !== 'playing') {
      socket.emit('actionAcknowledged', { error: '0x12' })
      console.error(
        'unexpected socket action event on finished match',
        JSON.stringify({ action, player })
      )
      return socket.disconnect()
    }
    player.match.actions[player.match.current][player.id] = {
      attack: action.attack,
      defence: action.defence,
    }
    socket.emit('actionAcknowledged', {
      ok: true,
    })
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

const getRandomizedHit = (maxHit) => Math.floor(Math.random() * maxHit + 1)

const characters = ['scorpion', 'kitana']
const actions = ['head', 'body', 'foot']
const damages = {
  head: 30,
  body: 25,
  foot: 20,
}
