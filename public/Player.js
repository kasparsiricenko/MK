class Player {
  constructor({ render = true, ...props } = {}) {
    this.name = props.name
    this.nameUpperCase = props.name.toUpperCase()
    this.position = props.position
    this.hp = props.hp ?? 100
    this.character = props.character
    this.img = props.img ?? `./assets/${this.character}.gif`
    this.weapon = props.weapon
    render && this.render()
  }
  attack() {
    console.log(`${this.name} Fight...`)
  }
  setHp(newHp) {
    this.hp = newHp
    this.renderHp()
  }
  renderHp() {
    this.$hp.style.width = `${this.hp}%`
  }
  render() {
    const $player = document.createElement('div')
    $player.classList.add(`player${this.position}`)

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
    $image.src = this.img

    $character.append($image)

    $life.style.width = `${this.hp}%`
    $name.append(this.name)

    this.$hp = $life

    const $arenas = document.getElementsByClassName('arenas')[0]

    $arenas.append($player)
  }
}

export default Player
