export const createElement = (element, className) => {
  const $element = document.createElement(element)
  $element.classList.add(className)
  return $element
}
