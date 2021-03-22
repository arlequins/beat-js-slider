export const dis = () => {
	return 'dis'
}

export const hasClass = (ele: any, cls: string) => {
  if (!ele.className) {
    return false
  }
  // tslint:disable-next-line:prefer-template
  return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'))
}

export const addClass = (ele: any, cls: string) => {
  if (!hasClass(ele,cls)) ele.className += ' '+cls
}

export const removeClass = (ele: any,cls: string) => {
  if (hasClass(ele,cls)) {
		// tslint:disable-next-line:prefer-template
    const reg = new RegExp('(\\s|^)'+cls+'(\\s|$)')
    ele.className=ele.className.replace(reg,' ')
  }
}
