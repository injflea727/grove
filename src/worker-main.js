;(function() {
"use strict"

var grove = Grove(RECORDS, BrowserController(self))

self.addEventListener('message', function(message) {
  var msgdata = message.data
  switch (msgdata.type) {

    case 'updateDataRecord':
      if (msgdata.name) {
        grove.editEntry(msgdata.name, msgdata.content)
      }
      break

    case 'keyDown':
      grove.handleKeyDown(msgdata.event)
      break

    case 'keyUp':
      grove.handleKeyUp(msgdata.event)
      break
  }
})

})();
