// assert that necessary globals exist
if (typeof Immutable !== 'object') throw 'immutable.js not found'
if (typeof FILES !== 'object') throw 'FILES global not found'

var dataStorage = DataStorage(FILES)

var $ = document.querySelectorAll.bind(document)

// DOM elements
var $diskSlot = $('#slot')[0]
var $powerSwitch = $('#power-switch')[0]
var $filesScript = $('#files')[0]

var $modalOverlay = $('#overlay')[0]
var $hideDataEditorButton = $('#file-modal .close-button button')[0]
var $showDataEditorButton = $('#data-editor-button')[0]
var $entryNameInput = $('#file-modal .file-selector input')[0]
var $entryContentInput = $('#file-modal textarea')[0]
var $dataEditorSaveButton = $('#file-modal .save')[0]

function click(elem, callback) {
  elem.addEventListener('click', callback)
}

function Grove(redraw) {
  var osMain = function() {
    // Users should never see this,
    // but if they do, I want them to open an issue.
    return ['Cryptic error ed626bdd!']
  }

  return {
    startup: startup,
    handleKeyUp: handleKeyUp,
    handleKeyDown: handleKeyDown
  }

  function handleKeyUp(keyCode, pressedKeys) {
    redraw(osMain({
      type: 'keyUp',
      keyCode: keyCode,
      pressedKeys: pressedKeys
    }))
  }

  function handleKeyDown(keyCode, pressedKeys) {
    redraw(osMain({
      type: 'keyDown',
      keyCode: keyCode,
      pressedKeys: pressedKeys
    }))
  }

  function startup() {
    var filename = 'system/startup.js'

    try {
      var startupjs = FILES[filename]

      if (typeof startupjs === 'undefined') {
        throw new Error('Tried to read from ' + filename + ', but there is no such file')
      }

      var obtainMain = '(function() { '
        // + 'var main;' // shadow the global `main` function so bootjs can define its own
        + 'return (function() {'
        + startupjs
        + ';return main})()})()'

      osMain = eval(obtainMain)

      if (typeof osMain !== 'function') {
        throw new Error(filename + ' needs to define a `main` function.')
      }
    } catch(e) {
      osMain = function() {
        return [
          '\u2588\u2584\u2580\u2584\u2580\u2588 Druidic Grove v0.1 \u2588\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2588',
          '',
          "Nice! You've just acquired a brand-new virtual computer.",
          "Unfortunately, the only thing installed on it is a program that",
          "just prints this text. Unless you're ready to sling some",
          ["JavaScript, you probably want to get a version that has an"],
          "operating system installed. See:",
          "",
          "https://github.com/druidic/MOSS",
          "",
          "If you already tried to install an operating system... bad news:",
          "it didn't work. The error message below might help you debug.",
          '',
          e.message
        ]
      }
    }
    redraw(osMain({type: 'startup'}))
  }
}

lastSaveTimestamp = +(new Date())
click($diskSlot, function() {
  $filesScript.innerText =
    'var FILES = ' + JSON.stringify(FILES)

  var pageData = document.documentElement.outerHTML
  var blob = new Blob([pageData], {type: 'text/html'})
  saveAs(blob, createFilename())
  lastSaveTimestamp = +(new Date())
})

click($showDataEditorButton, function() {
  $modalOverlay.style.display = 'block';
})

click($hideDataEditorButton, function() {
  $modalOverlay.style.display = 'none';
})

click($dataEditorSaveButton, function() {
  var name    = $entryNameInput.value
  var content = $entryContentInput.value

  if (!name) return
  dataStorage.write(name, content)
})

var isOn = true
click($powerSwitch, function() {
  isOn = !isOn

  if (isOn) {
    grove = Grove(redraw)
    grove.startup()
  } else {
    redraw([])
  }
})

function redraw(text) {
  var lines = $('#terminal p')
  if (!(text instanceof Array)) {
    text = [text]
  }
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerHTML = FancyText(text[i] || '').toString()
  }
}

function createFilename() {
  var date = new Date()
  var name = dataStorage.read('system/name') || 'grove'
  return name + '-' + formatDateForFilename(date)
}

function shouldWarnAboutUnsavedChanges() {
  return +(new Date()) - lastSaveTimestamp > 30 * 1000
}

var grove = Grove(redraw)
grove.startup()

var pressedKeys = Immutable.Set()
window.addEventListener('keydown', function(event) {
  var keyCode = event.keyCode
  pressedKeys = pressedKeys.add(keyCode)

  grove.handleKeyDown(keyCode, pressedKeys)
})

window.addEventListener('keyup', function(event) {
  var keyCode = event.keyCode
  pressedKeys = pressedKeys.remove(keyCode)

  grove.handleKeyUp(keyCode, pressedKeys)
})

window.addEventListener('beforeunload', function(e) {
  if (shouldWarnAboutUnsavedChanges()) {
    // This message isn't shown in Chrome but it might be in other browsers.
    return e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
  }
})
