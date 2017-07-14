/**
 * The purpose of wrappedEval is to limit the set of
 * variables that are in scope when `eval` is called. This
 * makes it easier to prevent eval'd code from accessing
 * things that it shouldn't.
 */
function wrappedEval (code) {
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
function Grove (records, actions) {

  // === State variables ==================================

  var data = DataRecorder(
    records, actions.notifyOfDataRecordChange)
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

  getGlobalObject().setInterval(handleClock, 50)

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
  }

  function runnableStartupScript (src) {
    var scriptText = '(function(){'
      + 'var ' + Object.keys(getGlobalObject()).join(',')
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
    var results

    if (!main) return

    if (permanentErrorOutput) {
      actions.redraw(permanentErrorOutput)
      return
    }

    try {
      results = main(event, ReadOnly(data))
    } catch(e) {
      var errorColors = {fg: 'black', bg: 'red', b: 1}
      results = permanentErrorOutput = [
        'The system encountered an error:',
        e.toString(),
        '',
        'Please take a screenshot and report this problem to',
        'the.wizard.ben@gmail.com'
      ]
    }

    /* The OS may return null from main() if no re-render
     * needs to be performed. This can be used as a performance
     * optimization since the OS can avoid recomputing the
     * screen buffer. */

    results = MainResults(results)

    if (results.records) {
      updateDataRecorder(results.records)
    }

    if (results.url) {
      actions.openUrl(results.url)
    }

    if (results.print) {
      actions.displayInNewWindow(results.print)
    }

    if (results.shouldRedraw) {
      printLineBuffers(results.screen.map(LineBuffer))
    }
  }

  function printErrorFromStartup (e) {
    printLineBuffers([
      LineBuffer('An error occurred while starting up:'),
      LineBuffer(e.toString())
    ])
  }

  function printStartupJsNotFoundError () {
    actions.redraw([
      "Grove " + VERSION,
      "",
      "Welcome! This Grove has no operating system installed yet.",
      // TODO: make Moss a real thing
      // "To get up and running quickly, please download a Grove snapshot",
      // "that includes an operating system. Snapshots are available at",
      // "",
      // "    https://github.com/druidic/moss/releases", {fg: 'white'},
      // "",
      "If you want to install or create a custom operating system,",
      "please read the guide available at",
      "",
      "    https://druidic.github.io/grove/guide",
      "",
      "If you get stuck, feel free to contact support:",
      "",
      "    the.wizard.ben@gmail.com"
    ])
  }

  function printLineBuffers(lineBuffers) {
    actions.redraw(lineBuffers.map(function(buffer) {
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

  function updateDataRecorder(newRecords) {
    for (var name in newRecords) {
      if (Object.prototype.hasOwnProperty.call(newRecords, name)) {
        data.write(name, newRecords[name])
      }
    }
  }
}
