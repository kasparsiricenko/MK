class Player {
  constructor(props) {
    this.name = props.name
    this.nameUpperCase = props.name.toUpperCase()
    this.player = props.player
    this.hp = props.hp
    this.img = props.img
    this.weapon = props.weapon
  }
  attack() {
    console.log(`${this.name} Fight...`)
  }
  changeHP(hit) {
    const newHp = this.hp - hit
    this.hp = newHp <= 0 ? 0 : newHp
  }
  elHP() {
    return document.querySelector(
      `.player${this.player} > .progressbar > .life`
    )
  }
  renderHP() {
    this.elHP().style.width = `${this.hp}%`
  }
}

export default Player
