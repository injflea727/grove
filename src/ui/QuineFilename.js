function formatDateForFilename(date) {
  var yyyy = date.getFullYear()
  var mo   = zeropad(date.getMonth() + 1)
  var dd   = zeropad(date.getDate())
  var hh   = zeropad(date.getHours())
  var mm   = zeropad(date.getMinutes())
  var ss   = zeropad(date.getSeconds())

  return [yyyy, mo, dd].join('-')
    + '__' + [hh, mm, ss].join('-')
}

function zeropad(n) {
  var s = n.toString()
  return s.length == 1 ? '0' + s : s
}

function QuineFilename(name, date) {
  var noBadChars = name.replace(/[^a-zA-Z0-9\-_\.]/g, '-')
  return noBadChars + '_' + formatDateForFilename(date)
    + '.html'
}
