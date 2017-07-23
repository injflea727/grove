var _64_SPACES
  = '                                '
  + '                                '

function makeScreenWidth(s) {
  s = typeof s === 'undefined'
    ? ''
    : '' + s

  return (s + _64_SPACES.slice(s.length)).slice(0, 64)
}
