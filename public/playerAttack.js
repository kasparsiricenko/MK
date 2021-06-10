import { HIT } from './config.js'
import { getRandomizedHit } from './utils.js'

const playerAttack = () => {
  const $hits = Array.from(document.getElementsByName('hit'))
  const $defences = Array.from(document.getElementsByName('defence'))
  const $hit = $hits.find(($hit) => $hit.checked)
  const hit = $hit.value
  const value = getRandomizedHit(HIT[hit])
  const $defence = $defences.find(($defence) => $defence.checked)
  const defence = $defence.value

  return { hit, value, defence }
}

export default playerAttack
