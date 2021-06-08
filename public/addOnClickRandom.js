import setWinTitle from './setWinTitle.js'
import { getRandomizedHit } from './utils.js'
import createReloadButton from './createReloadButton.js'

const addOnClickRandom = (player1, player2) => {
  const $randomButton = document.getElementsByClassName('button')[0]

  const onClick = (e) => {
    e.preventDefault()

    player1.changeHP(getRandomizedHit(20))
    player2.changeHP(getRandomizedHit(20))

    const lost1 = player1.hp <= 0
    const lost2 = player2.hp <= 0

    player1.renderHP()
    player2.renderHP()

    if (lost1 && lost2) {
      setWinTitle({ isDraw: true })
    } else if (lost1) {
      setWinTitle({ name: player2.name })
    } else if (lost2) {
      setWinTitle({ name: player1.name })
    } else {
      // returns to prevent disable random button sinse none player win and game is still going..
      return
    }
    const $arenas = document.getElementsByClassName('arenas')[0]
    const $reloadButton = createReloadButton()
    $arenas.append($reloadButton)

    $randomButton.disabled = true
  }

  $randomButton.addEventListener('click', onClick)
}

export default addOnClickRandom
