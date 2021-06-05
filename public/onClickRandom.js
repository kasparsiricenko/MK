import setWinTitle from './setWinTitle.js'
import changeHP from './changeHP.js'

const addOnClickRandom = (player1, player2) => {
  const $randomButton = document.getElementsByClassName('button')[0]
  const onClick = (e) => {
    e.preventDefault()

    const lost1 = changeHP(player1)
    const lost2 = changeHP(player2)

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
    $randomButton.disabled = true
  }
  $randomButton.addEventListener('click', onClick)
}

export default addOnClickRandom
