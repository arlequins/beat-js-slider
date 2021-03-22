import { SELECTED_CLASS_NAME } from '@app/constants'

export const makeFullHtml = (images: string[], currentIndex: number) => {
  if (images.length <= 0) {
    return ''
  }

  return `
  <div class="main-area">
    <div class="area-arrow">
      <div class="arrow arrow-left"></div>
    </div>
    <div class="area-middle-banner">
      ${images.map((image: string, index: number) => {
        const count = index + 1
        const classList = ['banner', `bs-image-${count}`]
        if (index === currentIndex) {
          classList.push(SELECTED_CLASS_NAME)
        }

        return `<a href="/banner-${count}"><img class="${classList.join(' ')}" src="${image}" /></a>`
      }).join('')}
    </div>
    <div class="area-arrow">
      <div class="arrow arrow-right"></div>
    </div>
  </div>
    ${images.length > 1 ? (
      `<div class="paging-area">
      ${images.map((_image: string, index: number) => {
        const count = index + 1
        const classList = ['number-btn', `btn-section-${count}`]
        if (index === currentIndex) {
          classList.push(SELECTED_CLASS_NAME)
        }

        return `<button class="${classList.join(' ')}" type="button">${count}</button>`
      }).join('')}
      </div>`
    ) : ``}
  </div>`
}

export const makeHtml = (images: string[], currentIndex: number) => {
  if (images.length <= 0) {
    return ''
  }

  return `
  <div class="main-area">
    <div class="area-middle-banner">
      ${images.map((image: string, index: number) => {
        const count = index + 1
        const classList = ['banner', `bs-image-${count}`]
        if (index === currentIndex) {
          classList.push(SELECTED_CLASS_NAME)
        }

        return `<a href="/banner-${count}"><img class="${classList.join(' ')}" src="${image}" /></a>`
      }).join('')}
    </div>
  </div>
    ${images.length > 1 ? (
      `<div class="paging-area">
      ${images.map((_image: string, index: number) => {
        const count = index + 1
        const classList = ['number-btn', `btn-section-${count}`]
        if (index === currentIndex) {
          classList.push(SELECTED_CLASS_NAME)
        }

        return `<button class="${classList.join(' ')}" type="button">${count}</button>`
      }).join('')}
      </div>`
    ) : ``}
  </div>`
}
