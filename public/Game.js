import log, { now } from './log.js'
import Player from './Player.js'
import setWinTitle from './setWinTitle.js'
import { createElement } from './utils.js'

export const Status = {
  Initial: 'initial',
  Started: 'started',

  SettingJoin: 'setting-join',

  Creating: 'creating',
  Joining: 'joining',

  WaitingJoin: 'waiting-join',

  Playing: 'playing',
  LostConnection: 'lost-connection',
  Finished: 'finished',
}

const createReloadButton = () => {
  const $reloadButton = createElement('button', 'button')
  $reloadButton.append('Restart')
  $reloadButton.addEventListener('click', () => window.location.reload())
  return $reloadButton
}

const _restart = function () {
  this.$startMenu.style.display = 'flex'
  return true
}

const _create = function () {
  const name = this.$nameInput.value
  if (typeof name !== 'string' || name.length < 1 || name.length > 16) {
    throw new Error()
  }
  this.name = name.toUpperCase()
  this.character = 'scorpion'
  this.socket.emit('create', { name: this.name, character: this.character })
  this.socket.on('created', (result) => {
    if (result.ok) {
      this.match = result.createdMatch
      this.waitJoin()
    } else {
      throw new Error(result.error)
    }
  })
  this.load(true, 'Creating match...')
  return true
}

const _waitJoin = function () {
  if (typeof this.match.id !== 'string' || this.match.id.length !== 6) {
    throw Error()
  }
  this.load(false)
  this.$startMenu.style.display = 'none'
  this.$matchPasscode.replaceChildren(this.match.id)
  this.$waitingMenu.style.display = 'flex'
  this.socket.on('opponentJoined', (result) => {
    if (result.ok) {
      // debugger
      this.timeout = result.timeout
      this.play(result.enemyPlayer)
      this.socket.off('opponentJoined')
    } else {
      throw new Error(result.error)
    }
  })
  return true
}

const _setJoin = function () {
  const name = this.$nameInput.value
  if (typeof name !== 'string' || name.length < 1 || name.length > 16) {
    throw new Error()
  }
  this.name = name.toUpperCase()
  this.$startMenu.style.display = 'none'
  this.$joinMenu.style.display = 'flex'
  return true
}

const _join = function () {
  if (
    typeof this.name !== 'string' ||
    this.name.length < 1 ||
    this.name.length > 16
  ) {
    throw new Error()
  }
  const matchId = this.$joinInput.value
  if (typeof matchId !== 'string' || matchId.length !== 6) {
    throw new Error()
  }
  this.match = { id: matchId }
  this.character = 'kitana'
  this.socket.emit('join', {
    match: this.match,
    player: { name: this.name, character: this.character },
  })
  this.socket.on('joined', (result) => {
    if (result.ok) {
      this.timeout = result.timeout
      this.play(result.enemyPlayer)
      this.socket.off('joined')
    } else {
      throw new Error(result.error)
    }
  })
  this.load(true, 'Trying to join a match...')
  return true
}

const _play = function (enemyPlayer) {
  this.player = new Player({
    name: this.name,
    character: this.character,
    position: 1,
  })
  this.enemyPlayer = new Player({
    name: enemyPlayer.name,
    character: enemyPlayer.character,
    position: 2,
  })
  this.load(false)
  this.$joinMenu.style.display = 'none'
  this.$waitingMenu.style.display = 'none'
  this.$controls.style.display = 'flex'

  log('start', { player1: this.player, player2: this.enemyPlayer })

  const onSumbit = (e) => {
    e.preventDefault()

    this.action = this.playerSubmitAttack()
    this.socket.emit('action', { action: this.action })
    this.$attackButton.disabled = true
  }

  this.$attackButton.onclick = onSumbit

  this.socket.on('actionResult', ({ ok, playerAction, enemyAction, error }) => {
    if (ok) {
      if (playerAction.defenceSuccess) {
        log('defence', {
          playerDefence: this.player,
          playerAttack: this.enemyPlayer,
        })
      } else {
        this.player.setHp(playerAction.hp)
        log('hit', {
          playerDefence: this.player,
          playerAttack: this.enemyPlayer,
          value: enemyAction.value,
        })
      }

      if (enemyAction.defenceSuccess) {
        log('defence', {
          playerDefence: this.enemyPlayer,
          playerAttack: this.player,
        })
      } else {
        this.enemyPlayer.setHp(enemyAction.hp)
        log('hit', {
          playerDefence: this.enemyPlayer,
          playerAttack: this.player,
          value: playerAction.value,
        })
      }
      this.action = null
      this.$attackButton.disabled = false
      _update.call(this)
    } else {
      throw Error(error)
    }
  })

  this.socket.on('actionAcknowledged', ({ ok, error }) => {
    if (ok) {
    } else {
      console.error(error)
    }
  })

  this.socket.on('finish', ({ ok, history }) => {
    this.finish()
  })
  this.timeLeft = this.timeout / 1000 - 1
  this.$topCenterWrap.replaceChildren(this.timeLeft)
  this.timer = setTimeout(() => _timeUpdate.call(this), 1000)
  return true
}

const _update = function () {
  this.timeLeft = this.timeout / 1000
  this.$topCenterWrap.replaceChildren(this.timeLeft)
  clearTimeout(this.timer)
  this.timer = setTimeout(() => _timeUpdate.call(this), 1000)
}

const _timeUpdate = function () {
  this.timeLeft--
  this.$topCenterWrap.replaceChildren(this.timeLeft)
  this.timer = setTimeout(() => _timeUpdate.call(this), 1000)
}

const _finish = function () {
  this.$controls.style.display = 'none'
  clearTimeout(this.timer)
  this.$topCenterWrap.replaceChildren(this.$reloadButton)
  const playerLost = this.player.hp <= 0
  const enemyPlayerLost = this.enemyPlayer.hp <= 0

  if (playerLost && enemyPlayerLost) {
    setWinTitle({ isDraw: true })
    log('draw')
  } else if (playerLost) {
    setWinTitle({ name: this.enemyPlayer.nameUpperCase })
    log('end', { playerWins: this.enemyPlayer, playerLose: this.player })
  } else if (enemyPlayerLost) {
    setWinTitle({ name: this.player.nameUpperCase })
    log('end', { playerWins: this.player, playerLose: this.enemyPlayer })
  }
}

class Game {
  constructor() {
    this.status = Status.Initial
    this.playerName = ''
    this.match = this.socket = window.io()
    this.loading = false
    this.$loader = document.getElementById('loader')
    this.$loaderText = document.getElementById('loader-text')
    this.$startMenu = document.getElementById('start-menu')
    this.$nameInput = document.getElementById('name-input')
    this.$joinMenu = document.getElementById('join-menu')
    this.$joinInput = document.getElementById('join-input')
    this.$joinMatchButton = document.getElementById('join-match-button')
    this.$createMatchButton = document.getElementById('create-match-button')
    this.$joinButton = document.getElementById('join-button')
    this.$waitingMenu = document.getElementById('waiting-menu')
    this.$matchPasscode = document.getElementById('match-passcode')
    this.$attackButton = document.getElementById('attack-button')
    this.$reloadButton = createReloadButton()
    this.$controls = document.getElementById('controls')
    this.$topCenterWrap = document.getElementById('top-center-wrap')
    this.$attacks = Array.from(document.getElementsByName('hit'))
    this.$defences = Array.from(document.getElementsByName('defence'))
    this.$backJoinButton = document.getElementById('back-join-button')
    window.GAME = this
    this.$createMatchButton.onclick = (e) => {
      e.preventDefault()
      this.create()
    }
    this.$joinMatchButton.onclick = (e) => {
      e.preventDefault()
      this.setJoin()
    }
    this.$joinButton.onclick = (e) => {
      e.preventDefault()
      this.join()
    }
    this.$backJoinButton.onclick = (e) => {
      e.preventDefault()
      this.restart({ from: 'fromJoinBackButton' })
    }
  }

  restart(props) {
    switch (this.status) {
      case Status.Initial:
        try {
          return _restart.call(this) && (this.status = Status.Started)
        } catch (error) {
          throw error
        }

      case Status.SettingJoin:
        try {
          if (props.from === 'fromJoinBackButton') {
            return _restart.call(this) && (this.status = Status.Started)
          } else {
            throw Error()
          }
        } catch (error) {
          throw error
        }

      case Status.Finished: {
        return (this.status = Status.Started)
      }
      case Status.LostConnection: {
        return (this.status = Status.Started)
      }
      default:
        throw Error()
    }
  }

  start() {
    this.restart()
  }

  setJoin() {
    switch (this.status) {
      case Status.Started:
        try {
          return _setJoin.call(this) && (this.status = Status.SettingJoin)
        } catch (error) {
          throw error
        }
      default:
        throw Error()
    }
  }

  create() {
    switch (this.status) {
      case Status.Started:
        try {
          return _create.call(this) && (this.status = Status.Creating)
        } catch (error) {
          throw error
        }

      default:
        throw Error()
    }
  }

  join() {
    switch (this.status) {
      case Status.SettingJoin:
        try {
          return _join.call(this) && (this.status = Status.Joining)
        } catch (error) {
          throw error
        }

      default:
        throw Error()
    }
  }

  waitJoin() {
    switch (this.status) {
      case Status.Creating:
        try {
          return _waitJoin.call(this) && (this.status = Status.WaitingJoin)
        } catch (error) {
          throw error
        }

      default:
        throw Error()
    }
  }

  play(enemyPlayer) {
    switch (this.status) {
      case Status.Joining:
        try {
          return _play.call(this, enemyPlayer) && (this.status = Status.Playing)
        } catch (error) {
          throw error
        }

      case Status.WaitingJoin:
        try {
          return _play.call(this, enemyPlayer) && (this.status = Status.Playing)
        } catch (error) {
          throw error
        }

      default:
        throw Error()
    }
  }

  loseConnection() {
    switch (this.status) {
      case Status.Playing: {
        return (this.status = Status.LostConnection)
      }
      default:
        throw Error()
    }
  }

  finish() {
    switch (this.status) {
      case Status.Playing:
        try {
          return _finish.call(this) && (this.status = Status.Finished)
        } catch (error) {
          throw error
        }

      default:
        throw Error()
    }
  }

  load(loading, text) {
    if (this.loading === loading) {
      if (loading) {
        this.$loaderText.replaceChildren(text)
      }
    } else {
      this.loading = loading
      if (this.loading) {
        this.$loader.style.display = 'flex'
        this.$loaderText.replaceChildren(text)
      } else {
        this.$loader.style.display = 'none'
      }
    }
  }

  playerSubmitAttack() {
    const $attack = this.$attacks.find(($attack) => $attack.checked)
    const attack = $attack.value
    const $defence = this.$defences.find(($defence) => $defence.checked)
    const defence = $defence.value

    return { attack, defence }
  }
}

export default Game
