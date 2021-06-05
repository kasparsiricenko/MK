const setWinTitle = ({ name, isDraw }) => {
  const title = isDraw ? 'draw' : `${name} wins`

  const $currentLoseTitle = document.getElementsByClassName('winTitle')[0]

  if ($currentLoseTitle === undefined) {
    const $loseTitle = document.createElement('div')
    $loseTitle.classList.add('winTitle')
    $loseTitle.append(title)

    const $arenas = document.getElementsByClassName('arenas')[0]
    $arenas.prepend($loseTitle)
    return
  }

  $currentLoseTitle.replaceChildren(title)
}

export default setWinTitle
