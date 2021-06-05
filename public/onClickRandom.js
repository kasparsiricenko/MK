import setLoseTitle from './setLoseTitle.js'
import changeHP from './changeHP.js'

const addOnClickRandom = (player1, player2) => {
  const randomButtonElement = document.getElementsByClassName('button')[0]
  const onClick = (e) => {
    e.preventDefault()

    const lost1 = changeHP(player1)
    const lost2 = changeHP(player2)

    if (lost1 && lost2) {
      return setLoseTitle({ isDraw: true })
    } else if (lost1) {
      return setLoseTitle({ name: player1.name })
    } else if (lost2) {
      return setLoseTitle({ name: player2.name })
    }
  }
  randomButtonElement.addEventListener('click', onClick)
}

export default addOnClickRandom
