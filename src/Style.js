function Style(_s) {
  var self
  var s = _s || {}

  return self = {
    toHTMLClasses: toHTMLClasses,
    overlay:       overlay
  }

  function toHTMLClasses() {
    var classes = []
    if (s.b) classes.push('bold')
    if (s.i) classes.push('italic')
    if (s.u) classes.push('underlined')
    return classes.join(' ')
  }

  function overlay(_s) {
    Object.assign(s, _s)
    return self
  }
}
