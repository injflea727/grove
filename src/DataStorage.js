DataStorage = function(entries) {
  var dataStorage = {}

  dataStorage.read = function(entryName) {
    if (isNotString(entryName)) {
      throw Error('DataStorage#read expects to be called with a string, but got ' + entryName)
    }
    return entries.get(entryName) || ''
  }

  dataStorage.write = function(entryName, content) {
    if (isNotString(entryName) || isNotString(content)) {
      throw Error('DataStorage#write expects to be called with two strings, but got ' + entryName + ', ' + content)
    }
    if (content === '') {
      return dataStorage.delete(entryName)
    }
    return DataStorage(entries.set(entryName, content))
  }

  dataStorage.delete = function(entryName) {
    return DataStorage(entries.delete(entryName))
  }

  dataStorage.toJSON = function() {
    return JSON.stringify(entries.toJS())
  }

  function isNotString(thing) {
    return typeof thing !== 'string'
  }

  return dataStorage
}
