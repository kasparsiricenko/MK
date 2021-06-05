const setLoseTitle = ({ name, isDraw }) => {
  const title = isDraw ? 'draw' : `${name} lost`

  const $currentLoseTitle = document.getElementsByClassName('loseTitle')[0]

  if ($currentLoseTitle === undefined) {
    const $loseTitle = document.createElement('div')
    $loseTitle.classList.add('loseTitle')
    $loseTitle.append(title)

    const $arenas = document.getElementsByClassName('arenas')[0]
    $arenas.prepend($loseTitle)
    return
  }

  $currentLoseTitle.replaceChildren(title)
}

export default setLoseTitle
