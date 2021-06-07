class Player {
  constructor(props) {
    this.name = props.name
    this.player = props.player
    this.hp = props.hp
    this.img = props.img
    this.weapon = props.weapon
  }
  attack() {
    console.log(`${this.name} Fight...`)
  }
  renderHP(hit) {
    const newHp = player.hp - hit
    const lost = newHp <= 0
    player.hp = lost ? 0 : newHp
    return lost
  }
  elHP() {
    return document.querySelector(
      `.player${player.player} > .progressbar > .life`
    )
  }
  renderHP() {
    this.elHP().style.width = `${this.hp}%`
  }
}

export default Player
