function MainResults(raw) {
  var results = {
    screen:       wrapInArray(rawScreen()).map(stringify),
    shouldRedraw: rawScreen() !== null
  }

  if (raw) {
    Object.assign(results, {
      records:   isObject(raw.records) ? raw.records : null,
      url:       isString(raw.url) ? raw.url : null,
      print:     stringify(raw.print),
      shouldPrint: shouldPrint()
    })
  }

  return results

  function rawScreen() {
    return isObject(raw) ? raw.screen : raw
  }

  function shouldPrint() {
    return hasProperty(raw, 'print')
      && raw.print !== null
  }
}

function isString(thing) {
  return typeof thing === 'string'
}

function isObject(thing) {
  return Object.prototype.toString.call(thing)
    === '[object Object]'
}

function hasProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop)
}

function stringify(thing) {
  return '' + thing
}

function wrapInArray(thing) {
  if (thing && thing.constructor === Array) {
    return thing
  }
  return [thing]
}
