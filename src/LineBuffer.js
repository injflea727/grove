/**
 * A LineBuffer object represents a single line of output
 * as displayed on the Grove's screen.
 *
 * As such, it is limited to a 64-character width. When
 * text is added to the LineBuffer, a style object may also
 * be given to colorize or add bold/italic/underline styling
 * to the added text.
 *
 * The LineBuffer escapes HTML input, so untrusted text
 * may be passed in.
 */
function LineBuffer(_text, _style) {
  // --- State variable declarations -----------------------

  var self
  var text
  var perCharStyle = []
  for (var i = 0; i < 64; i++) {
    perCharStyle.push(Style(_style))
  }

  // --- Initialization ------------------------------------

  text = _64_SPACES; paste(_text)

  // --- Public interface declaration ----------------------

  return self = {
    toHTML: toHTML,
    paste:  paste,
    type:   LineBuffer.type
  }

  // --- Public method definitions -------------------------

  function toHTML() {
    var perCharClasses = perCharStyle.map(function(s) {
      return s.toHTMLClasses()
    })

    var classEdges = edges(perCharClasses)
    segments = splitAtIndices(classEdges, makeScreenWidth(text))

    var pos = 0
    return segments.map(htmlEscape).map(function(seg) {
      var cls = perCharClasses[pos]
      pos += seg.length

      if (!cls) {
        return seg
      } else {
        return '<span class="' + cls + '">'
          + seg
          + '</span>'
      }
    }).join('')
  }

  function paste(added, start, style) {
    if (added === undefined) {
      added = ''
    }
    start = start || 0
    var end = start + added.length
    text = text.slice(0, start)
      + added
      + text.slice(end)

    for (var i = start; i < end && i < 64; i++) {
      perCharStyle[i].overlay(style)
    }

    return self
  }
}

LineBuffer.type = {}

var _64_SPACES
  = '                                '
  + '                                '

function makeScreenWidth(s) {
  return (s + _64_SPACES.slice(s.length)).slice(0, 64)
}

function edges(list) {
  var output = []
  for (var i = 1; i < list.length; i++) {
    if (list[i] !== list[i - 1]) {
      output.push(i)
    }
  }
  return output
}

function splitAtIndices(indices, string) {
  if (!indices.length) return [string]
  var segments = []
  for (var i = -1; i < indices.length; i++) {
    segments.push(string.slice(+indices[i], indices[i+1]))
  }
  return segments
}

function htmlEscape(string) {
  return string.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}
