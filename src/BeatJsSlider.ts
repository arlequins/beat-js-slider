import { CLASS_NAME, DEFAULT_NUMBER, DEFAULT_SCROLL_DIRECTION, DEFAULT_SCROLL_INTERVAL, IMG_CLASS_NAME, RENDERED_CLASS_NAME, SELECTED_CLASS_NAME } from '@app/constants'
import { addClass, dis, removeClass } from '@app/helpers'
import { makeHtml } from '@app/templates'

interface Option {
	classNames?: {
		init?: string
		image?: string
	},
	scroll?: {
		interval?: number
		direction?: string
    use?: boolean
	},
}

interface TargetStatusResult {
  arrow: {
    left: string
    right: string
  },
  currentPage: number
  paging: string[]
  images: string[]
  targetIndex: number
  target: Element
}

interface TargetStatus {
  result?: TargetStatusResult
  flag: boolean
}

class BeatJsSlider {
  public status: {
    render: boolean[],
    action: boolean[],
  }
  public allStatus: TargetStatus[]
  private option: Option

  constructor(option: Option) {
    this.option = option
    this.allStatus = [] as TargetStatus[]
  }

  static testCase = () => {
    return dis()
  }

  public init = () => {
    const initClassName = this.option?.classNames?.init ? this.option.classNames.init : CLASS_NAME
    const targets = window.document.getElementsByClassName(initClassName)

    if (targets.length <= 0) {
      return
    }

    const status = {
      render: [] as boolean[],
      action: [] as boolean[],
    }

    let curIndex = 0
    for (const target of targets) {
      const curStatus = this.render(target, curIndex)
      status.render.push(curStatus)
      curIndex ++
    }

    for (const [index, flag] of status.render.entries()) {
      if (flag) {
        const currentTarget = this.allStatus[index]
        if (currentTarget.flag && currentTarget.result) {
          const last = this.addAction(index)
          status.action.push(last)
        } else {
          status.action.push(false)
        }
      } else {
        status.action.push(false)
      }
    }

    this.status = status
  }

  private render = (target: Element, curIndex: number) => {
    const initImgClassName = this.option?.classNames?.image ? this.option.classNames.image : IMG_CLASS_NAME
    const imageElements = target.getElementsByClassName(initImgClassName)

    const imageCount = imageElements.length

    if (imageCount <= 0) {
      this.allStatus.push({
        flag: true,
      })
      return false
    }

    const imageUrlList = [] as string[]

    for (const imageElement of imageElements) {
      const uri = imageElement.getAttribute('src')
      if (uri) {
        imageUrlList.push(uri)
      }
    }

    const html = makeHtml(imageUrlList, DEFAULT_NUMBER)

    if (html.length <= 0) {
      this.allStatus.push({
        flag: true,
      })
      return false
    }

    target.innerHTML = html
    addClass(target, RENDERED_CLASS_NAME)

    // add actions
    const curTargetInfo = {
      result: {
        arrow: {
          left: 'arrow-left',
          right: 'arrow-right',
        },
        paging: imageUrlList.map((_image: string, index: number) => `btn-section-${index + 1}`),
        images: imageUrlList.map((_image: string, index: number) => `bs-image-${index + 1}`),
        targetIndex: curIndex,
        target: target,
        currentPage: DEFAULT_NUMBER,
      },
      flag: true,
    }

    this.allStatus.push(curTargetInfo)

    return true
  }

  private findTargetStatus = (targetIndex: number) => {
    const targetStatus = this.allStatus[targetIndex]
    if (!targetStatus.flag) {
      return false
    }

    if (!targetStatus.result) {
      return false
    }
    const targetStatusResult = targetStatus.result
    return targetStatusResult
  }

  private addAction = (targetIndex: number) => {
    const targetStatusResult = this.findTargetStatus(targetIndex)
    if (!targetStatusResult) {
      return false
    }
    const baseElement = targetStatusResult.target

    // arrow
    const leftArrow: any = baseElement.getElementsByClassName(targetStatusResult.arrow.left).length > 0 ? baseElement.getElementsByClassName(targetStatusResult.arrow.left)[0] : false
    const rightArrow: any = baseElement.getElementsByClassName(targetStatusResult.arrow.right).length > 0 ? baseElement.getElementsByClassName(targetStatusResult.arrow.right)[0] : false

    if (!leftArrow || !rightArrow) {
      return false
    }

    leftArrow.onclick = (_e: any) => {
      this.btnClickEvent(targetIndex, targetStatusResult, baseElement, -1)
    }

    rightArrow.onclick = (_e: any) => {
      this.btnClickEvent(targetIndex, targetStatusResult, baseElement, 1)
    }

    // btn - arrow
    for (const [curBtnIndex, pagingClassName] of targetStatusResult.paging.entries()) {
      const pagingBtn: any = baseElement.getElementsByClassName(pagingClassName).length > 0 ? baseElement.getElementsByClassName(pagingClassName)[0] : false
      if (pagingBtn) {
        pagingBtn.onclick = (_e: any) => {
          this.btnClickEvent(targetIndex, targetStatusResult, baseElement, 0, curBtnIndex)
        }
      }
    }

    // slider event
    if (this.option.scroll?.use) {
      const interval = this.option.scroll?.interval ? this.option.scroll?.interval : DEFAULT_SCROLL_INTERVAL
      setInterval(() => this.setIntervalAction(targetIndex, targetStatusResult, baseElement), interval)
    }

    return true
  }

  private setIntervalAction = (targetIndex: number, targetStatusResult: TargetStatusResult, baseElement: Element) => {
    this.btnClickEvent(targetIndex, targetStatusResult, baseElement, -999)
  }

  private setAutoScrollNextNumber = (currentPageIndex: number, maxNumber: number) => {
    let next
    if (currentPageIndex === maxNumber) {
      next = 0
    } else {
      next = currentPageIndex + 1
    }
    return next
  }

  private imageScrollEvent = (baseElement: Element, currentClassName: string, nextClassName: string) => {
    const currentImage: any = baseElement.getElementsByClassName(currentClassName).length > 0 ? baseElement.getElementsByClassName(currentClassName)[0] : false

    const scrollType = this.option.scroll?.direction ? this.option.scroll?.direction : DEFAULT_SCROLL_DIRECTION
    const scrollClassName = {
      in: `scroll-action-${scrollType}-in`,
      out: `scroll-action-${scrollType}-out`,
    }
    if (currentImage) {
      addClass(currentImage, scrollClassName.out)

      setTimeout(() => {
        removeClass(currentImage, SELECTED_CLASS_NAME)
        removeClass(currentImage, scrollClassName.out)
      }, 200)
    }

    const nextImage: any = baseElement.getElementsByClassName(nextClassName).length > 0 ? baseElement.getElementsByClassName(nextClassName)[0] : false
    if (nextImage) {
      addClass(nextImage, scrollClassName.in)
      setTimeout(() => {
        addClass(nextImage, SELECTED_CLASS_NAME)
      }, 200)
      setTimeout(() => {
        removeClass(nextImage, scrollClassName.in)
      }, 250)
    }
  }

  private btnClickEvent = (targetIndex: number, targetStatusResult: TargetStatusResult, baseElement: Element, nextPageNumber: number, currentNumber?: number) => {
    const renewTargetStatusResult = this.findTargetStatus(targetIndex)
    if (!renewTargetStatusResult) {
      return
    }
    const currentPageIndex = renewTargetStatusResult.currentPage
    const maxNumber = targetStatusResult.images.length
    const isBtnClick = Number.isInteger(currentNumber)
    const isAutoScroll = nextPageNumber === -999
    const currentNextPageNumber = !isAutoScroll ? nextPageNumber : this.setAutoScrollNextNumber(currentPageIndex, maxNumber - 1)

    if (!isBtnClick && !isAutoScroll) {
      if (currentNextPageNumber > 0) {
        if (currentPageIndex + 1 >= maxNumber) {
          return
        }
      } else {
        if (currentPageIndex <= 0) {
          return
        }
      }
    }

    const nextPageIndex = !isBtnClick && !isAutoScroll ? currentPageIndex + currentNextPageNumber : isAutoScroll ? currentNextPageNumber : currentNumber ? currentNumber : 0

    this.imageScrollEvent(baseElement, targetStatusResult.images[currentPageIndex], targetStatusResult.images[nextPageIndex])

    const currentPaging: any = baseElement.getElementsByClassName(targetStatusResult.paging[currentPageIndex])
    if (currentPaging.length > 0) {
      removeClass(currentPaging[0], SELECTED_CLASS_NAME)
    }

    const nextPaging: any = baseElement.getElementsByClassName(targetStatusResult.paging[nextPageIndex])
    if (nextPaging.length > 0) {
      addClass(nextPaging[0], SELECTED_CLASS_NAME)
    }

    this.allStatus[targetStatusResult.targetIndex] = {
      flag: true,
      result: {
        ...targetStatusResult,
        currentPage: nextPageIndex,
      },
    }
  }
}

export default BeatJsSlider
