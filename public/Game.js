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

const _restart = function () {
  this.$startMenu.style.display = 'flex'
  return true
}

const _create = function () {
  const name = this.$nameInput.value
  if (typeof name !== 'string' || (name.length < 1 && name.length > 16)) {
    throw new Error()
  }
  this.name = name.toUpperCase()
  this.socket.emit('create', { name: this.name, character: 'scorpion' })
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
      this.enemyPlayer = result.enemyPlayer
      this.play()
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
  this.socket.emit('join', {
    match: this.match,
    player: { name: this.name, character: 'scorpion' },
  })
  this.socket.on('joined', (result) => {
    if (result.ok) {
      this.enemyPlayer = result.enemyPlayer
      this.play()
      this.socket.off('joined')
    } else {
      throw new Error(result.error)
    }
  })
  this.load(true, 'Trying to join a match...')
  return true
}

const _play = function () {
  this.load(false)
  this.$joinMenu.style.display = 'none'
  this.$waitingMenu.style.display = 'none'
  this.$controls.style.display = 'flex'
  return true
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
    this.$reloadButton = document.getElementById('reload-button')
    this.$controls = document.getElementById('controls')
    this.restart()
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
  }

  restart() {
    switch (this.status) {
      case Status.Initial:
        try {
          return _restart.call(this) && (this.status = Status.Started)
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

  play() {
    switch (this.status) {
      case Status.Joining:
        try {
          return _play.call(this) && (this.status = Status.Playing)
        } catch (error) {
          throw error
        }

      case Status.WaitingJoin:
        try {
          return _play.call(this) && (this.status = Status.Playing)
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
      case Status.Playing: {
        return (this.status = Status.Finished)
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
}

export default Game
