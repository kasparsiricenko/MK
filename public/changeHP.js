import { getRandomizedHit } from './utils.js'

const changeHP = (player) => {
  const hit = getRandomizedHit(20)
  const newHp = player.hp - hit
  const lost = newHp <= 0

  player.hp = lost ? 0 : newHp

  const playerLifeElement = document.querySelector(
    `.player${player.player} > .progressbar > .life`
  )

  playerLifeElement.style.width = `${player.hp}%`

  return lost
}

export default changeHP
