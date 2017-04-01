/**
 * A LineBuffer object represents a single line of output
 * as displayed on the Grove's screen.
 *
 * As such, it is limited to a 64-character width. When
 * text is added to the LineBuffer, a formatting object
 * may also be given to colorize or add bold/italic/under-
 * line formatting to the added text.
 *
 * The LineBuffer escapes HTML input, so untrusted text
 * may be passed in.
 */
function LineBuffer(_text) {
  // --- State variable declarations -----------------------

  var self
  var text

  // --- Initialization ------------------------------------

  text = _64_SPACES; paste(_text)

  // --- Public interface declaration ----------------------

  return self = {
    toHTML: toHTML,
    paste:  paste
  }

  // --- Public method definitions -------------------------

  function toHTML() {
    return htmlEscape(makeScreenWidth(text))
  }

  function paste(added, index) {
    index = index || 0
    text = text.slice(0, index)
      + added
      + text.slice(index + added.length)

    return self
  }
}

var _64_SPACES
  = '                                '
  + '                                '

function makeScreenWidth(s) {
  return (s + _64_SPACES.slice(s.length)).slice(0, 64)
}
