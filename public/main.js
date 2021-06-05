import createPlayer from './createPlayer.js'
import Player from './Player.js'

let socket = io()

const player1 = new Player({
  name: 'SCORPION',
  player: 1,
  hp: 100,
  img: './assets/scorpion.gif',
  weapon: ['vodka'],
})

const player2 = new Player({
  name: 'KITANA',
  player: 2,
  hp: 100,
  img: './assets/kitana.gif',
  weapon: ['whiskey'],
})

createPlayer('player1', player1)
createPlayer('player2', player2)
