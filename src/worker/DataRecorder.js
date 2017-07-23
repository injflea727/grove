function DataRecorder(records, changeCallback) {
  var recorder = {}
  var changeCallback = changeCallback || function() {}

  recorder.read = function(recordName) {
    if (isNotString(recordName)) {
      throw Error('DataRecorder#read expects to be called with a string, but got ' + recordName)
    }
    return records[recordName] || ''
  }

  recorder.write = function(recordName, content) {
    if (isNotString(recordName) || isNotString(content)) {
      throw Error('DataRecorder#write expects to be called with two strings, but got ' + recordName + ', ' + content)
    }

    if (content === '') {
      delete records[recordName]
    } else {
      records[recordName] = content
    }

    changeCallback(recordName, content)
    return recorder
  }

  recorder.toJSON = function() {
    return JSON.stringify(records)
  }

  function isNotString(thing) {
    return typeof thing !== 'string'
  }

  return recorder
}
