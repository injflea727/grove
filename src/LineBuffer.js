var _64_SPACES
  = '                                '
  + '                                '

function makeScreenWidth(s) {
  return (s + _64_SPACES.slice(s.length)).slice(0, 64)
}

function LineBuffer(text) {
  return {
    toHTML: toHTML
  }

  function toHTML() {
    return htmlEscape(makeScreenWidth(text))
  }
}
