const createPlayer = (playerClass, player) => {
  const playerElement = document.createElement('div')
  playerElement.classList.add(playerClass)

  const progressBarElement = document.createElement('div')
  progressBarElement.classList.add('progressbar')

  const characterElement = document.createElement('div')
  characterElement.classList.add('character')

  playerElement.append(progressBarElement, characterElement)

  const lifeElement = document.createElement('div')
  lifeElement.classList.add('life')

  const nameElement = document.createElement('div')
  nameElement.classList.add('name')

  progressBarElement.append(lifeElement, nameElement)

  const imgElement = new Image()
  imgElement.src = player.img

  characterElement.append(imgElement)

  lifeElement.style.width = `${player.hp}%`
  nameElement.append(player.name)

  const arenasElement = document.getElementsByClassName('arenas')[0]

  arenasElement.append(playerElement)
}

export default createPlayer
