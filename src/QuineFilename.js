function formatDateForFilename(date) {
  var parts = date.toISOString().split(/[\-T:\.]/)
  return parts.slice(0, 3).join('-') + '_'
    + parts.slice(3, 6).join('-')
}

function QuineFilename(name, date) {
  var nameReplaced = name.replace(/[^a-zA-Z0-9\-_\.]/g, '-')
  return nameReplaced + '_' + formatDateForFilename(date)
}
