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
function LineBuffer(_text, _format) {
  // --- State variable declarations -----------------------

  var self
  var text
  var isBold
  var isItalic
  var isUnderlined

  // --- Initialization ------------------------------------

  text         = _64_SPACES; paste(_text)
  isBold       = _format && _format.bold
  isItalic     = _format && _format.italic
  isUnderlined = _format && _format.underlined

  // --- Public interface declaration ----------------------

  return self = {
    toHTML: toHTML,
    paste:  paste
  }

  // --- Public method definitions -------------------------

  function toHTML() {
    var escaped = htmlEscape(makeScreenWidth(text))

    var classes = []
    if (isBold) {
      classes.push('bold')
    }
    if (isItalic) {
      classes.push('italic')
    }
    if (isUnderlined) {
      classes.push('underlined')
    }

    if (classes.length) {
      return '<span class="' + classes.join(' ') + '">'
        + escaped
        + '</span>'
    } else {
      return escaped
    }
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
