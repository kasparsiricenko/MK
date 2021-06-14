import { getRandom } from './utils.js'

const now = () => '[' + window.dayjs().format('hh:mm:ss.SSS') + ']'

const formatText = (type, options = {}) =>
  Object.entries(options).reduce(
    (result, [key, value]) => result.replace(`[${key}]`, value),
    Array.isArray(logs[type])
      ? logs[type][getRandom(logs[type].length)]
      : logs[type]
  )

const simpleFormatText = (type, playerDefence, playerKick) =>
  logs[type][getRandom(logs[type].length)]
    .replace('[playerDefence]', playerDefence.name.toUpperCase())
    .replace('[playerKick]', playerKick.name.toUpperCase())

const logs = {
  start:
    'Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.',
  end: [
    'Результат удара [playerWins]: [playerLose] - труп',
    '[playerLose] погиб от удара бойца [playerWins]',
    'Результат боя: [playerLose] - жертва, [playerWins] - убийца',
  ],
  hit: [
    '[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.',
    '[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.',
    '[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.',
    '[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.',
    '[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.',
    '[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.',
    '[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.',
    '[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.',
    '[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.',
    '[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.',
    '[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.',
    '[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.',
    '[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.',
    '[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.',
    '[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.',
    '[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.',
    '[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.',
    '[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.',
  ],
  defence: [
    '[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.',
    '[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.',
    '[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.',
    '[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.',
    '[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.',
    '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
    '[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.',
    '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
  ],
  draw: 'Ничья - это тоже победа!',
}

const generateLogs = (
  type,
  {
    player1,
    player2,
    playerDefence,
    playerAttack,
    playerWins,
    playerLose,
    value,
  } = {}
) => {
  switch (type) {
    case 'start':
      return formatText(type, {
        time: window.dayjs().format('hh:mm'),
        player1: player1.nameUpperCase,
        player2: player2.nameUpperCase,
      })
    case 'end': {
      return formatText(type, {
        playerWins: playerWins.nameUpperCase,
        playerLose: playerLose.nameUpperCase,
      })
    }
    case 'hit': {
      const text = formatText(type, {
        playerDefence: playerDefence.nameUpperCase,
        playerKick: playerAttack.nameUpperCase,
      })
      return `${now()}: ${text} -${value} [${playerDefence.hp}/100]`
    }
    case 'defence': {
      const text = formatText(type, {
        playerDefence: playerDefence.nameUpperCase,
        playerKick: playerAttack.nameUpperCase,
      })
      return `${now()}: ${text}`
    }
    case 'draw':
      return formatText(type)
  }
}

const $chat = document.getElementsByClassName('chat')[0]

const log = (type, options) => {
  const log = generateLogs(type, options)
  const $log = document.createElement('p')
  $log.append(log)
  $chat.prepend($log)
}

export default log
