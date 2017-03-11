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

  // === Public interface declaration =====================

  return {
    turnOn: turnOn
  }

  // === Public function definitions ======================

  function turnOn() {
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

  // === Private functions ================================

  function runnableStartupScript (src) {
    return '(function(){'
      + 'var ' + Object.keys(getGlobalObject()).join(',')
      + ';' + src
      + 'return main'
      + '})()'
  }

  function bootFromStartupScript () {
    var script = runnableStartupScript(getStartupJs())
    var main = wrappedEval(script)

    printTrustedOutput([htmlEscape(main())])
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
    return files['system/startup.js']
  }

  function getGlobalObject () {
    if (typeof window !== 'undefined') {
      return window
    }
    return global
  }

  function htmlEscape(string) {
    return string.toString()
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
  }
}
