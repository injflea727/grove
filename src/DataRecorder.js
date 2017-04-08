DataRecorder = function(entries) {
  var recorder = {}

  recorder.read = function(entryName) {
    if (isNotString(entryName)) {
      throw Error('DataRecorder#read expects to be called with a string, but got ' + entryName)
    }
    return entries.get(entryName) || ''
  }

  recorder.write = function(entryName, content) {
    if (isNotString(entryName) || isNotString(content)) {
      throw Error('DataRecorder#write expects to be called with two strings, but got ' + entryName + ', ' + content)
    }
    if (content === '') {
      return recorder.delete(entryName)
    }
    return DataRecorder(entries.set(entryName, content))
  }

  recorder.delete = function(entryName) {
    return DataRecorder(entries.delete(entryName))
  }

  recorder.toJSON = function() {
    return JSON.stringify(entries.toJS())
  }

  function isNotString(thing) {
    return typeof thing !== 'string'
  }

  return recorder
}
