DataRecorder = function(entries, changeCallback) {
  var recorder = {}
  var changeCallback = changeCallback || function() {}

  recorder.read = function(entryName) {
    if (isNotString(entryName)) {
      throw Error('DataRecorder#read expects to be called with a string, but got ' + entryName)
    }
    return entries[entryName] || ''
  }

  recorder.write = function(entryName, content) {
    if (isNotString(entryName) || isNotString(content)) {
      throw Error('DataRecorder#write expects to be called with two strings, but got ' + entryName + ', ' + content)
    }

    if (content === '') {
      delete entries[entryName]
    } else {
      entries[entryName] = content
    }

    changeCallback(entryName, content)
    return recorder
  }

  recorder.toJSON = function() {
    return JSON.stringify(entries)
  }

  function isNotString(thing) {
    return typeof thing !== 'string'
  }

  return recorder
}
