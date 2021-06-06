const createPlayer = (player) => {
  const $player = document.createElement('div')
  $player.classList.add(`player${player.player}`)

  const $progressBar = document.createElement('div')
  $progressBar.classList.add('progressbar')

  const $character = document.createElement('div')
  $character.classList.add('character')

  $player.append($progressBar, $character)

  const $life = document.createElement('div')
  $life.classList.add('life')

  const $name = document.createElement('div')
  $name.classList.add('name')

  $progressBar.append($life, $name)

  const $image = new Image()
  $image.src = player.img

  $character.append($image)

  $life.style.width = `${player.hp}%`
  $name.append(player.name)

  const $arenas = document.getElementsByClassName('arenas')[0]

  $arenas.append($player)
}

export default createPlayer
