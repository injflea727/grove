/* sample OS to test that the Grove is working */
var keys = {}
var text = ''
var cursorBlink = 0
var eventOutput = 'Start typing! Text is saved when you press ENTER.'
var error

function main(event, dataRecorder) {
  var toSave = {}
  if (event.type === 'startup') {
    text = dataRecorder.read('myfile')
  }

  if (event.type === 'keyDown') {
    keys[event.key] = true
    switch (event.key) {
      case 13:
        // enter
        text += '\n'
        toSave['myfile'] = text
        break
      case 8:
        // backspace
        text = text.slice(0, text.length - 1)
        break
      case 192:
        // tilde
        // test that we can recover from an infinite loop
        while (true) {}
      case 27:
        // escape
        // test that errors are printed
        error = error ? null : "You pressed escape. Press it again to recover."
      default:
        text += String.fromCharCode(event.key)
    }

    updateEventOutput(event)
  }

  if (event.type === 'keyUp') {
    delete keys[event.key]

    updateEventOutput(event)
  }

  if (event.type === 'clock') {
    cursorBlink = (cursorBlink + 1) % 20
  }

  if (error) {
    throw error
  }

  return {
    screen: systemBar(eventOutput)
      .concat(cursor(text).split('\n')),
    records: toSave
  }
}

function systemBar(string) {
  var style = {
    fg: 'black',
    bg: 'goldenrod',
    b: 1
  }

  return [LineBuffer(string, style)]
}

function cursor(string) {
  if (cursorBlink >= 10) return string + '\u2592'
  return string
}

function updateEventOutput(event) {
  eventOutput =
    '' + event.type + ' ' + Object.keys(keys).join(', ')
}
