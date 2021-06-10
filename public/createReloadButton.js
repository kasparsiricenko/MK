import { createElement } from './utils.js'

const createReloadButton = () => {
  const $reloadWrap = createElement('div', 'reloadWrap')
  const $reloadButton = createElement('button', 'button')
  $reloadWrap.append($reloadButton)
  $reloadButton.append('Restart')
  $reloadButton.addEventListener('click', () => window.location.reload())
  return $reloadWrap
}

export default createReloadButton
