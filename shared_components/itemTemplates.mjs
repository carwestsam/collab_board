export default function ({type, stack, bg_color, newId}) {
  switch (type) {
    case 'sticker':
      return {
        id: newId,
        type,
        bg_color,
        text: 'New ' + type,
        width: 120,
        height: 120,
        stack
      }
    case 'group':
      return {
        id: newId,
        type,
        bg_color,
        text: 'New ' + type,
        width: 300,
        height: 300,
        stack
      }
  }
}