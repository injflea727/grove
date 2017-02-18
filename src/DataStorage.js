DataStorage = function(entries) {
  var dataStorage = {}

  dataStorage.read = function(entryName) {
    return entries[entryName] || ''
  }

  dataStorage.write = function(entryName, content) {
    if (content === undefined || content === '' || content === null) {
      delete entries[entryName]
    } else {
      entries[entryName] = '' + content
    }
  }

  return dataStorage
}
