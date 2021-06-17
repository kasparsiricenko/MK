const playerAttack = () => {
  const $hits = Array.from(document.getElementsByName('hit'))
  const $defences = Array.from(document.getElementsByName('defence'))
  const $attack = $hits.find(($hit) => $hit.checked)
  const attack = $attack.value
  const $defence = $defences.find(($defence) => $defence.checked)
  const defence = $defence.value

  return { attack, defence }
}

export default playerAttack
