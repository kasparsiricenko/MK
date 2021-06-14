import setWinTitle from './setWinTitle.js'
import createReloadButton from './createReloadButton.js'
import enemyAttack from './enemyAttack.js'
import playerAttack from './playerAttack.js'
import log from './log.js'

const addOnSubmitAttack = (player1, player2) => {
  log('start', { player1, player2 })

  const onSumbit = (e) => {
    e.preventDefault()

    const player1Attack = playerAttack()
    const player2Attack = enemyAttack()

    if (player1Attack.defence === player2Attack.hit) {
      log('defence', { playerDefence: player1, playerAttack: player2 })
    } else {
      player1.changeHP(player2Attack.value)
      player1.renderHP()
      log('hit', {
        playerDefence: player1,
        playerAttack: player2,
        value: player2Attack.value,
      })
    }

    if (player2Attack.defence === player1Attack.hit) {
      log('defence', { playerDefence: player2, playerAttack: player1 })
    } else {
      player2.changeHP(player1Attack.value)
      player2.renderHP()
      log('hit', {
        playerDefence: player2,
        playerAttack: player1,
        value: player1Attack.value,
      })
    }

    const player1Lost = player1.hp <= 0
    const player2Lost = player2.hp <= 0

    if (player1Lost && player2Lost) {
      setWinTitle({ isDraw: true })
      log('draw')
    } else if (player1Lost) {
      setWinTitle({ name: player2.name })
      log('end', { playerWins: player2, playerLose: player1 })
    } else if (player2Lost) {
      setWinTitle({ name: player1.name })
      log('end', { playerWins: player1, playerLose: player2 })
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
