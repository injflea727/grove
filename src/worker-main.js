;(function() {
"use strict"

var grove = Grove(FILES, redraw, notifyOfDataRecordChange)

self.addEventListener('message', function(message) {
  var msgdata = message.data
  switch (msgdata.type) {

    case 'updateDataRecord':
      updateDataRecord(msgdata.name, msgdata.content)
      break

    case 'keyDown':
      grove.handleKeyDown(msgdata.event)
      break

    case 'keyUp':
      grove.handleKeyUp(msgdata.event)
      break
  }
})

function updateDataRecord(name, content) {
  if (!name) return
  grove.editEntry(name, content)
}

function notifyOfDataRecordChange(name, content) {
  self.postMessage({
    type: 'dataRecordChange',
    name: name,
    content: content
  })
}

function redraw(trustedHTMLLines) {
  self.postMessage({
    type: 'redraw',
    value: trustedHTMLLines
  })
}

})();
