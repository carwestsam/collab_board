export default function () {
  return {
    getRandomInt: function (min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
    limitRange: function (value, minimum, maximum) {
      if (value < minimum) {
        return minimum
      } else if (value > maximum) {
        return maximum
      } else {
        return value
      }
    }
  }
}
