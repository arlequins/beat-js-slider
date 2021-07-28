import BeatJsSlider from '@app/BeatJsSlider'
import { ExtendedWindow } from 'common'

// tslint:disable:no-import-side-effect
import '@app/assets/scss/main.scss'

console.log('hello world')

const win: ExtendedWindow = (window as unknown) as ExtendedWindow

win.BeatSlider = BeatJsSlider
