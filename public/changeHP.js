import { getRandomizedHit } from './utils.js'

const changeHP = (player) => {
  const hit = getRandomizedHit(20)
  const newHp = player.hp - hit
  const lost = newHp <= 0

  player.hp = lost ? 0 : newHp

  const $playerLife = document.querySelector(
    `.player${player.player} > .progressbar > .life`
  )

  $playerLife.style.width = `${player.hp}%`

  return lost
}

export default changeHP
