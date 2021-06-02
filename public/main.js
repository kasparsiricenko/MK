import createPlayer from './createPlayer.js'
import Player from './Player.js'

let socket = io()

const player1 = new Player({
  name: 'SCORPION',
  hp: 14,
  img: './assets/scorpion.gif',
  weapon: ['vodka'],
})

const player2 = new Player({
  name: 'KITANA',
  hp: 88,
  img: './assets/kitana.gif',
  weapon: ['whiskey'],
})

createPlayer('player1', player1)
createPlayer('player2', player2)
