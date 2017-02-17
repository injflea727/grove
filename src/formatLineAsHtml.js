function htmlEscape(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function formatLineAsHtml(line) {
  if (typeof line === 'string') {
    return htmlEscape(line)
  } else if (line instanceof Array) {
    return line.map(formatLineAsHtml).join('')
  } else {
    if (line.color) {
      return '<span style="color:' + line.color + '">'
        + htmlEscape(line.text)
        + '</span>'
    } else {
      return htmlEscape(line.text)
    }
  }
}
