import * as d3 from 'd3-color'

let stickerRotater = 0
let groupRotater = 0
export function getRandomColor (type) {
  if (type === 'sticker') {
    stickerRotater = (stickerRotater + 137.5) % 360
    // return `hsl(${stickerRotater}, 100%, 70%)`
    let h = stickerRotater
    let s = 80
    let l = 90
    let result = d3.hcl(h, s, l).toString()
    return result
  } else if (type === 'group') {
    groupRotater = (groupRotater + 45.83) % 360
    return `hsl(${groupRotater}, 100%, 95%)`
  }
}
