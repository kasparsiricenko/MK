import createPlayer from './createPlayer.js'
import addOnClickRandom from './addOnClickRandom.js'
import Player from './Player.js'
import { getRandomizedHit } from './utils.js'

let socket = io()

const HIT = {
  head: 30,
  body: 25,
  foot: 20,
}
const ATTACK = ['head', 'body', 'foot']

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

const onSumbit = () => {
  console.log('submitted')
}

const $form = document.querySelector('form.control')
$form.addEventListener('submit', onSumbit)

const getRandom = (max) => {
  return Math.floor(Math.random() * max)
}

const enemyAttack = () => {
  const hit = ATTACK[getRandom(ATTACK.length)]
  const value = getRandomizedHit(HIT[hitType])
  const defence = ATTACK[getRandom(ATTACK.length)]
  return { hit, value, defence }
}

addOnClickRandom(player1, player2)
