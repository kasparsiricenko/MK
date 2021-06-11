export const getRandomizedHit = (maxHit) =>
  Math.floor(Math.random() * maxHit + 1)

export const createElement = (element, className) => {
  const $element = document.createElement(element)
  $element.classList.add(className)
  return $element
}

export const getRandom = (max) => {
  return Math.floor(Math.random() * max)
}
