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
  e.preventDefault()

  const $hits = document.getElementsByName('hit')
  const $defences = document.getElementsByName('defence')
  const hit = $hits.find(($hit) => $hit.checked)
  const value = getRandomizedHit(HIT[hit])
  const defence = $defences.find(($defence) => $defence.checked)

  const player1Attack = { hit, value, defence }
  const player2Attack = enemyAttack()

  const player1BlockedAttack = player1Attack.defence === player2Attack.hit
  const player2BlockedAttack = player2Attack.defence === player1Attack.hit

  player1BlockedAttack === false && player1.changeHP(player2Attack.value)
  player2BlockedAttack === false && player2.changeHP(player1Attack.value)

  const player1Lost = player1.hp <= 0
  const player2Lost = player2.hp <= 0

  player1.renderHP()
  player2.renderHP()

  if (lost1 && lost2) {
    setWinTitle({ isDraw: true })
  } else if (lost1) {
    setWinTitle({ name: player2.name })
  } else if (lost2) {
    setWinTitle({ name: player1.name })
  } else {
    // returns to prevent disable submit button sinse none player win and game is still going..
    return
  }

  const $arenas = document.getElementsByClassName('arenas')[0]
  const $reloadButton = createReloadButton()
  $arenas.append($reloadButton)

  const $submitButton = document.querySelector(
    '.control > .buttonWrap > .button'
  )
  $submitButton.disabled = true
}

const $form = document.querySelector('form.control')
$form.addEventListener('submit', onSumbit)

const getRandom = (max) => {
  return Math.floor(Math.random() * max)
}

const enemyAttack = () => {
  const hit = ATTACK[getRandom(ATTACK.length)]
  const value = getRandomizedHit(HIT[hit])
  const defence = ATTACK[getRandom(ATTACK.length)]
  return { hit, value, defence }
}
