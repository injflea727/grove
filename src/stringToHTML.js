function stringToHTML(s) {
  var ESC='\33'
  var segments = s.split(ESC)
  var output = segments[0]

  var spanOpen = false
  var currentForeground = null
  var currentBackground = null
  var foregroundInSpan = null
  var backgroundInSpan = null

  function closeAnyOpenSpan() {
    if (spanOpen) {
      output += '</span>'
    }
  }

  for (var i = 1; i < segments.length; i++) {
    var formatCode = segments[i].charAt(0)
    var text = segments[i].slice(1)

    if (isForeground(formatCode)
      && currentForeground !== formatCode) {

      currentForeground = formatCode
    }

    if (isBackground(formatCode)
      && currentBackground !== formatCode) {

      currentBackground = formatCode
    }

    if (text &&
      (  currentForeground !== foregroundInSpan
      || currentBackground !== backgroundInSpan)) {

      closeAnyOpenSpan()
      output += '<span class="'
        + className(currentForeground, currentBackground)
        + '">'

      foregroundInSpan = currentForeground
      backgroundInSpan = currentBackground
      spanOpen = true
    }

    output += text
  }

  closeAnyOpenSpan()

  return output
}

function className(fg, bg) {
  var output = ''
  if (fg) {
    output += 'fg-' + fg
    if (bg) {
      output += ' '
    }
  }
  if (bg) {
    output += 'bg-' + bg.toLowerCase()
  }
  return output
}

function isForeground(formatCode) {
  return formatCode === 'c'
    || formatCode === 'm'
    || formatCode === 'y'
    || formatCode === 'k'
    || formatCode === 'r'
    || formatCode === 'g'
    || formatCode === 'b'
    || formatCode === 'o'
    || formatCode === 'v'
    || formatCode === 'w'
}

function isBackground(formatCode) {
  return formatCode === 'C'
    || formatCode === 'M'
    || formatCode === 'Y'
    || formatCode === 'K'
    || formatCode === 'R'
    || formatCode === 'G'
    || formatCode === 'B'
    || formatCode === 'O'
    || formatCode === 'V'
    || formatCode === 'W'
}
