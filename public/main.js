import createPlayer from './createPlayer.js'
import addOnClickRandom from './addOnClickRandom.js'
import Player from './Player.js'
import { getRandomizedHit } from './utils.js'
import addOnSubmitAttack from './addOnSubmitAttack.js'

let socket = io()

const player1 = new Player({
  name: 'scorpion',
  player: 1,
  hp: 100,
  img: './assets/scorpion.gif',
  weapon: ['vodka'],
})

const player2 = new Player({
  name: 'kitana',
  player: 2,
  hp: 100,
  img: './assets/kitana.gif',
  weapon: ['whiskey'],
})

createPlayer(player1)
createPlayer(player2)

addOnSubmitAttack(player1, player2)
