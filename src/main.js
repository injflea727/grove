;(function() {
"use strict"

var $ = document.querySelectorAll.bind(document)

// --- DOM elements ---------------------------------------

var $diskSlot = $('#slot')[0]
var $powerSwitch = $('#power-switch')[0]
var $filesScript = $('#files')[0]
var $groveWorkerScript = $('#grove-worker')[0]
var $modalOverlay = $('#overlay')[0]
var $hideDataEditorButton = $('#file-modal .close-button button')[0]
var $showDataEditorButton = $('#data-editor-button')[0]
var $entryNameInput = $('#file-modal .file-selector input')[0]
var $entryContentInput = $('#file-modal textarea')[0]
var $dataEditorSaveButton = $('#file-modal .save')[0]
var $title = $('head title')[0]

// --- Initial state --------------------------------------

var dataRecords = FILES
var lastSaveTimestamp = +(new Date())
var groveWorker = GroveWorker(
  dataRecords,
  handleMessageFromWorker)

setTitleTo(getComputerName(dataRecords))

// --- Event handler setup --------------------------------

click($diskSlot, function() {
  $filesScript.innerText
    = 'var FILES = ' + JSON.stringify(dataRecords)

  var pageData = document.documentElement.outerHTML
  var blob = new Blob([pageData], {type: 'text/html'})
  saveAs(blob, createFilename(getComputerName(dataRecords)))
  lastSaveTimestamp = +(new Date())
})

click($showDataEditorButton, function() {
  $modalOverlay.style.display = 'block';
  $entryNameInput.focus()
})

click($hideDataEditorButton, function() {
  $modalOverlay.style.display = 'none';
})

click($dataEditorSaveButton, function() {
  var name    = $entryNameInput.value
  var content = $entryContentInput.value

  if (!name) return

  dataRecords[name] = content

  groveWorker.postMessage({
    type: 'updateDataRecord',
    name: name,
    content: content
  })
})

click($powerSwitch, function() {
  if (groveWorker) {
    // turn off
    groveWorker.terminate()
    groveWorker = null
    redraw([])
  } else {
    // turn on
    groveWorker = GroveWorker(dataRecords, handleMessageFromWorker)
  }
})

window.addEventListener('beforeunload', function(e) {
  if (shouldWarnAboutUnsavedChanges()) {
    // This message isn't shown in Chrome but it might be in other browsers.
    return e.returnValue = "You have unsaved changes. Are you sure you want to leave?"
  }
})

window.addEventListener('keydown', function(e) {
  if (groveWorker) {
    groveWorker.postMessage({type: 'keyDown', event: {keyCode: e.keyCode}})
  }
})

window.addEventListener('keyup', function(e) {
  if (groveWorker) {
    groveWorker.postMessage({type: 'keyUp', event: {keyCode: e.keyCode}})
  }
})

// --- Function definitions -------------------------------

function handleMessageFromWorker(msg) {
  switch (msg.data.type) {
    case 'redraw':
      redraw(msg.data.value)
      break
    case 'dataRecordChange':
      dataRecords[msg.data.name] = msg.data.content
      setTitleTo(getComputerName(dataRecords))
      break
  }
}

function GroveWorker(dataRecords, messageCallback) {
  var scriptBlob = new Blob([
    'var FILES = ',
    JSON.stringify(dataRecords),
    ';',
    $groveWorkerScript.innerText
  ])

  var worker = new Worker(URL.createObjectURL(scriptBlob))
  worker.addEventListener('message', messageCallback)
  return worker
}

function click(elem, callback) {
  elem.addEventListener('click', callback)
}

function setTitleTo(title) {
  $title.innerText = title
}

function redraw(text) {
  var lines = $('#terminal p')
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerHTML = text[i] || ''
  }
}

function createFilename(computerName) {
  var date = new Date()
  return computerName + '-' + formatDateForFilename(date)
}

function shouldWarnAboutUnsavedChanges() {
  return +(new Date()) - lastSaveTimestamp > 30 * 1000
}

})();
