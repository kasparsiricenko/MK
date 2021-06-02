function Player(props) {
  this.name = props.name
  this.hp = props.hp
  this.img = props.img
  this.weapon = props.weapon
}

Player.prototype = {
  attack: function () {
    console.log(`${this.name} Fight...`)
  },
}

export default Player
