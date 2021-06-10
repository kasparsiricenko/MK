import { ATTACK, HIT } from './config.js'
import { getRandomizedHit, getRandom } from './utils.js'

const enemyAttack = () => {
  const hit = ATTACK[getRandom(ATTACK.length)]
  const value = getRandomizedHit(HIT[hit])
  const defence = ATTACK[getRandom(ATTACK.length)]
  return { hit, value, defence }
}

export default enemyAttack
