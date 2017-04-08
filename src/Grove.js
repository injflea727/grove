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

/**
 * Grove() creates and returns an object representing a
 * Grove computer. It is intended to encapsulate all the
 * interesting logic and state involved in running a
 * Grove system, while keeping that logic isolated from
 * the browser environment (to make it easier to test).
 */
function Grove (files, printTrustedOutput) {
  "use strict"

  // === State variables ==================================

  var on      = false
  var data    = DataRecorder(Immutable.Map(files))
  var main    = null

  // === Public interface declaration =====================

  return {
    turnOn:        turnOn,
    turnOff:       turnOff,
    isOn:          isOn,
    getName:       getName,
    editEntry:     editEntry,
    getDataAsJSON: getDataAsJSON,
    handleKeyDown: handleKeyDown,
    handleKeyUp:   handleKeyUp
  }

  // === Public function definitions ======================

  function turnOn() {
    on = true
    if (getStartupJs()) {
      try {
        bootFromStartupScript()
      } catch(e) {
        printErrorFromStartup(e)
      }
    } else {
      printStartupJsNotFoundError()
    }
  }

  function turnOff() {
    on = false
    printTrustedOutput([])
  }

  function isOn() {
    return on
  }

  function editEntry(name, content) {
    data = data.write(name, content)
  }

  function getDataAsJSON() {
    return data.toJSON()
  }

  function handleKeyDown(event) {
    runMainAndPrintOutput({type: 'keyDown', key: event.keyCode})
  }

  function handleKeyUp(event) {
    runMainAndPrintOutput({type: 'keyUp', key: event.keyCode})
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
    if (!main || !isOn()) return

    var output = main(event, data)

    if (output === undefined) {
      output = '' + output
    }

    if (output.data) {
      data = output.data
    }

    if (Object.prototype.hasOwnProperty.call(output, 'screen')) {
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
      'Tried to read from system/startup.js, but there '
        + 'is no such entry'
    ])
  }

  function getStartupJs() {
    return data.read('system/startup.js')
  }

  function getGlobalObject () {
    if (typeof window !== 'undefined') {
      return window
    }
    return global
  }

  function getName() {
    return data.read('system/name') || 'grove'
  }

  function notWhitelistedGlobal(varName) {
    return varName !== 'LineBuffer'
  }
}
