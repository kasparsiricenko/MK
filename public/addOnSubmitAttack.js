import setWinTitle from './setWinTitle.js'
import createReloadButton from './createReloadButton.js'
import enemyAttack from './enemyAttack.js'
import playerAttack from './playerAttack.js'

const addOnSubmitAttack = (player1, player2) => {
  const onSumbit = (e) => {
    e.preventDefault()

    const player1Attack = playerAttack()
    const player2Attack = enemyAttack()

    if (player1Attack.defence === player2Attack.hit) {
      console.log(
        `${player1.name.toUpperCase()} blocked ${player1Attack.defence.toUpperCase()}`
      )
    } else {
      player1.changeHP(player2Attack.value)
      player1.renderHP()
    }

    if (player2Attack.defence === player1Attack.hit) {
      console.log(
        `${player2.name.toUpperCase()} blocked ${player2Attack.defence.toUpperCase()}`
      )
    } else {
      player2.changeHP(player1Attack.value)
      player2.renderHP()
    }

    const player1Lost = player1.hp <= 0
    const player2Lost = player2.hp <= 0

    if (player1Lost && player2Lost) {
      setWinTitle({ isDraw: true })
    } else if (player1Lost) {
      setWinTitle({ name: player2.name })
    } else if (player2Lost) {
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
}

export default addOnSubmitAttack
