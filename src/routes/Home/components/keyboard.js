export default {
  isUp (e) {
    return e.keyCode === 38
  },

  isDown (e) {
    return e.keyCode === 40
  },

  isLeft (e) {
    return e.keyCode === 37
  },

  isRight (e) {
    return e.keyCode === 39
  },

  isEnter (e) {
    return e.keyCode === 13 || e.keyCode === 9
  },

  isDelete (e) {
    return e.keyCode === 8
  },

  isBold (e) {
    return e.keyCode === 66 && (e.metaKey || e.ctrlKey)
  },

  isUnderLine (e) {
    return e.keyCode === 85 && (e.metaKey || e.ctrlKey)
  },

  isItalics (e) {
    return e.keyCode === 73 && (e.metaKey || e.ctrlKey)
  },

  isPageup (e) {
    return e.keyCode === 33
  },

  isPagedown (e) {
    return e.keyCode === 34
  },

  isEscape (e) {
    return e.keyCode === 27
  },
}
