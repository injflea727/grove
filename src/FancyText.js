function htmlEscape(string) {
  return string.toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}


function escapeIfString(s) {
  return typeof s === 'string'
    ? htmlEscape(s)
    : s
}

function FancyText(s, format) {
  var parts = [
    {string: s, format: format}
  ]

  var self
  return self = {
    toString: function() {
      return parts.map(function(p) {
        if (p.format) {
          return '<span style="'
            + formatObjectToStyleString(p.format)
            + '">' + escapeIfString(p.string) + '</span>'
        } else {
          return '' + escapeIfString(p.string)
        }
      }).join('')
    },

    append: function(s, format) {
      parts.push({string: s, format: format})
      return self
    }
  }
}

function formatObjectToStyleString(format) {
  var out = []
  if (format.text) {
    out.push('color:' + format.text)
  }
  if (format.highlight) {
    out.push('background-color:' + format.highlight)
  }
  return out.join(';')
}
