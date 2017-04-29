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
  var permanentErrorOutput = null

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

  getGlobalObject().setTimeout(handleClock, 0)

  // === Public interface declaration =====================

  return {
    editEntry:     editEntry,
    getDataAsJSON: getDataAsJSON,
    handleKeyDown: handleKeyDown,
    handleKeyUp:   handleKeyUp,
    handleClock:   handleClock
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

  function handleClock() {
    runMainAndPrintOutput({
      type: 'clock',
      time: +new Date()
    })
    getGlobalObject()
      .setTimeout(handleClock, timeUntilNextFrame(+new Date(), 20))
  }

  function runnableStartupScript (src) {
    var scriptText = '(function(){'
      + 'var ' + Object.keys(getGlobalObject())
        .filter(notWhitelistedGlobal).join(',')
      + ';' + src
      + 'return main'
      + '})()'

    return scriptText
  }

  function bootFromStartupScript () {
    var script = runnableStartupScript(getStartupJs())
    main = wrappedEval(script)
    runMainAndPrintOutput({type: 'startup'})
  }

  function runMainAndPrintOutput(event) {
    if (!main) return

    if (permanentErrorOutput) {
      printLineBuffers(permanentErrorOutput)
      return
    }

    var output
    try {
      output = main(event, ReadOnly(data))
    } catch(e) {
      var errorColors = {fg: 'black', bg: 'red', b: 1}
      output = permanentErrorOutput = [
        LineBuffer('The system encountered an error:', errorColors),
        LineBuffer(e.toString(), errorColors),
        LineBuffer('', errorColors),
        LineBuffer('Please take a screenshot and report this problem to', errorColors),
        LineBuffer('the.wizard.ben@gmail.com', errorColors)
      ]
    }

    /* The OS may return null from main() if no re-render
     * needs to be performed. This can be used as a performance
     * optimization since the OS can avoid recomputing the
     * screen buffer. */
    if (output === null) {
      return
    }

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

    printLineBuffers(output)
  }

  function printErrorFromStartup (e) {
    printTrustedOutput([
      'An error occurred while starting up:',
      htmlEscape(e.toString())
    ])
  }

  function printStartupJsNotFoundError () {
    printLineBuffers([
      LineBuffer("Grove " + VERSION, {u: 1}),
      LineBuffer(""),
      LineBuffer("Welcome! This Grove has no operating system installed yet."),
      LineBuffer("To get up and running quickly, please download a Grove snapshot"),
      LineBuffer("that includes an operating system. Snapshots are available at"),
      LineBuffer(""),
      LineBuffer("    https://github.com/druidic/moss/releases", {fg: 'white'}),
      LineBuffer(""),
      LineBuffer("If you want to install or create a custom operating system,"),
      LineBuffer("please read the guide available at"),
      LineBuffer(""),
      LineBuffer("    https://druidic.github.io/grove/guide", {fg: 'white'}),
      LineBuffer(""),
      LineBuffer("If you run into problems, feel free to contact support:"),
      LineBuffer(""),
      LineBuffer("    the.wizard.ben@gmail.com", {fg: 'white'})
    ])
  }

  function printLineBuffers(lineBuffers) {
    printTrustedOutput(lineBuffers.map(function(buffer) {
      return buffer.toHTML()
    }))
  }

  function getStartupJs() {
    return data.read('startup')
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
