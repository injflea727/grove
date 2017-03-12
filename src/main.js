;(function() {
"use strict"

// assert that necessary globals exist
if (typeof Immutable !== 'object') throw 'immutable.js not found'
if (typeof FILES !== 'object') throw 'FILES global not found'

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
var $title = $('head title')[0]

function click(elem, callback) {
  elem.addEventListener('click', callback)
}

function setTitleToComputerName() {
  $title.innerText = grove.getName()
}

var lastSaveTimestamp = +(new Date())
click($diskSlot, function() {
  $filesScript.innerText =
    'var FILES = ' + grove.getDataAsJSON()

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
  grove.editEntry(name, content)
})

click($powerSwitch, function() {
  if (grove.isOn()) {
    grove.turnOff()
  } else {
    grove.turnOn()
  }
})

function redraw(text) {
  var lines = $('#terminal p')
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerHTML = text[i] || ''
  }
}

function createFilename() {
  var date = new Date()
  return grove.getName() + '-' + formatDateForFilename(date)
}

function shouldWarnAboutUnsavedChanges() {
  return +(new Date()) - lastSaveTimestamp > 30 * 1000
}

window.addEventListener('beforeunload', function(e) {
  if (shouldWarnAboutUnsavedChanges()) {
    // This message isn't shown in Chrome but it might be in other browsers.
    return e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
  }
})

window.addEventListener('keydown', function(e) {
  grove.handleKeyDown(e)
})

window.addEventListener('keyup', function(e) {
  grove.handleKeyUp(e)
})

var grove = Grove(FILES, redraw)
grove.turnOn()
setTitleToComputerName()

})();
