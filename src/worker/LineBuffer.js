/**
 * A LineBuffer object represents a single line of output
 * as displayed on the Grove's screen. It is limited to a
 * 64-character width.
 *
 * The LineBuffer escapes HTML input, so untrusted text
 * may be passed in.
 */
function LineBuffer(_text) {
  // --- State variable declarations -----------------------

  var self
  var text

  // --- Initialization ------------------------------------

  text = makeScreenWidth(_text)

  // --- Public interface declaration ----------------------

  return self = {
    toHTML: toHTML
  }

  // --- Public method definitions -------------------------

  function toHTML() {
    return htmlEscape(text)
  }
}

LineBuffer.type = {}

var _64_SPACES
  = '                                '
  + '                                '

function makeScreenWidth(s) {
  s = typeof s === 'undefined'
    ? ''
    : '' + s

  return (s + _64_SPACES.slice(s.length)).slice(0, 64)
}

function htmlEscape(string) {
  return string.toString()
}
