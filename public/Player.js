class Player {
  constructor(props) {
    this.name = props.name
    this.hp = props.hp
    this.img = props.img
    this.weapon = props.weapon
  }
  attack() {
    console.log(`${this.name} Fight...`)
  }
}

export default Player
