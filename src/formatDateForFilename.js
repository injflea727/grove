function formatDateForFilename(date) {
  var parts = date.toISOString().split(/[\-T:\.]/)
  return parts[0] + parts[1] + parts[2]
      + '-' + parts[3] + parts[4] + parts[5]
}
