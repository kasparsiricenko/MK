import Player from './Player.js'

let socket = io()

const createPlayer = (player) => {
  const playerElement = document.createElement('div')
  playerElement.classList.add('player1')

  document.body.append(playerElement)

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

  lifeElement.style.width = '100%'
  nameElement.append(player.name)
}

const player1 = new Player({
  name: 'Scorpion',
  hp: 100,
  img: 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif',
  weapon: ['vodka'],
})

createPlayer(player1)
