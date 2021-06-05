const setLoseTitle = ({ name, isDraw }) => {
  const title = isDraw ? 'draw' : `${name} lost`

  const currentLoseTitleElement =
    document.getElementsByClassName('loseTitle')[0]

  if (currentLoseTitleElement === undefined) {
    const loseTitleElement = document.createElement('div')
    loseTitleElement.classList.add('loseTitle')
    loseTitleElement.append(title)

    const arenasElement = document.getElementsByClassName('arenas')[0]
    arenasElement.prepend(loseTitleElement)
    return
  }

  currentLoseTitleElement.replaceChildren(title)
}

export default setLoseTitle
