/**
 * The purpose of wrappedEval is to limit the set of
 * variables that are in scope when `eval` is called. This
 * makes it easier to prevent eval'd code from accessing
 * things that it shouldn't.
 */
function wrappedEval (code) {
  "use strict"
  var Grove
  return eval(code)
}

var hasOwnProperty = Object.prototype.hasOwnProperty

/**
 * Grove() creates and returns an object representing a
 * Grove computer. It is intended to encapsulate all the
 * interesting logic and state involved in running a
 * Grove system, while keeping that logic isolated from
 * the browser environment (to make it easier to test).
 */
function Grove (
    records,
    printTrustedOutput,
    dataChangeCallback) {

  "use strict"

  // === State variables ==================================

  var data = DataRecorder(records, dataChangeCallback)
  var main = null
  var keysHeld = {}

  // === Initialization ===================================

  if (getStartupJs()) {
    try {
      bootFromStartupScript()
    } catch(e) {
      printErrorFromStartup(e)
    }
  } else {
    printStartupJsNotFoundError()
  }

  // === Public interface declaration =====================

  return {
    editEntry:     editEntry,
    getDataAsJSON: getDataAsJSON,
    handleKeyDown: handleKeyDown,
    handleKeyUp:   handleKeyUp
  }

  // === Public function definitions ======================

  function editEntry(name, content) {
    data = data.write(name, content)
  }

  function getDataAsJSON() {
    return data.toJSON()
  }

  function handleKeyDown(event) {
    var key = event.keyCode
    if (keysHeld[key]) return
    keysHeld[key] = true
    runMainAndPrintOutput({type: 'keyDown', key: key})
  }

  function handleKeyUp(event) {
    var key = event.keyCode
    delete keysHeld[key]
    runMainAndPrintOutput({type: 'keyUp', key: key})
  }

  // === Private functions ================================

  function runnableStartupScript (src) {
    return '(function(){'
      + 'var ' + Object.keys(getGlobalObject())
        .filter(notWhitelistedGlobal).join(',')
      + ';' + src
      + 'return main'
      + '})()'
  }

  function bootFromStartupScript () {
    var script = runnableStartupScript(getStartupJs())
    main = wrappedEval(script)
    runMainAndPrintOutput({type: 'startup'})
  }

  function runMainAndPrintOutput(event) {
    if (!main) return

    var output = main(event, ReadOnly(data))

    if (output === undefined) {
      output = '' + output
    }

    if (output.records) {
      updateDataRecorder(output.records)
    }

    if (hasOwnProperty.call(output, 'screen')) {
      output = output.screen
    }

    if (output.constructor !== Array) {
      output = [output]
    }

    for (var i = 0; i < output.length; i++) {
      if (output[i].type !== LineBuffer.type) {
        output[i] = LineBuffer(output[i])
      }
    }

    printTrustedOutput(output.map(function(line) {
      return line.toHTML()
    }))
  }

  function printErrorFromStartup (e) {
    printTrustedOutput([
      'An error occurred while starting up:',
      htmlEscape(e.toString())
    ])
  }

  function printStartupJsNotFoundError () {
    printTrustedOutput([
      "Can't start up because system/startup.js is empty."
    ])
  }

  function getStartupJs() {
    return data.read('system/startup.js')
  }

  function getGlobalObject () {
    if (typeof self !== 'undefined') {
      return self
    }
    return global
  }

  function notWhitelistedGlobal(varName) {
    return varName !== 'LineBuffer'
  }

  function updateDataRecorder(newRecords) {
    for (var name in newRecords) {
      if (Object.prototype.hasOwnProperty.call(newRecords, name)) {
        data.write(name, newRecords[name])
      }
    }
  }
}
