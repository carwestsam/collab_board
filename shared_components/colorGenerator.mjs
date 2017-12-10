import * as d3 from 'd3-color'

let sticker_rotater = 0
let groupRotater = 0
export function getRandomColor (type) {
  if (type === 'sticker') {
    sticker_rotater = (sticker_rotater + 137.5) % 360
    // return `hsl(${stickerRotater}, 100%, 70%)`
    let h = sticker_rotater
    let s = 80
    let l = 90
    let result = d3.hcl(h, s, l).toString()
    return result
  } else if (type === 'group') {
    groupRotater = (groupRotater + 45.83) % 360
    return `hsl(${groupRotater}, 100%, 95%)`
  }
}
