// assert that necessary globals exist
if (typeof Immutable !== 'object') throw 'immutable.js not found'
if (typeof FILES !== 'object') throw 'FILES global not found'

var keyboardState = {keysHeld: []}
var osMain = function() {
  return 'If you can read this, something broke.'
}

document.getElementById('slot').addEventListener('click', function() {
  document.getElementById('files').innerText =
    'var FILES = ' + JSON.stringify(FILES)

  var pageData = document.documentElement.outerHTML
  var blob = new Blob([pageData], {type: 'text/html'})
  saveAs(blob, 'saved.html')
})

var overlay = document.getElementById('overlay')
document.querySelector('#file-modal .close-button button')
  .addEventListener('click', function() {
    overlay.style.display = 'none';
  })

document.getElementById('data-editor-button')
  .addEventListener('click', function() {
    overlay.style.display = 'block';
  })

window.addEventListener('keydown', function(event) {
  var keyCode = event.keyCode

  if (contains(keyboardState.keysHeld, keyCode)) {
    return
  }

  keyboardState.lastKeyPressed = keyCode
  addUnique(keyboardState.keysHeld, keyCode)
  callMain({type: 'keydown', keyCode: keyCode})
})

window.addEventListener('keyup', function(event) {
  var kb = state.__SYSTEM__.keyboard
  var keyCode = event.keyCode

  if (!contains(kb.keysHeld, keyCode)) {
    return
  }

  remove(kb.keysHeld, keyCode)
  callMain({type: 'keyup', keyCode: keyCode})
})

function redraw(text) {
  var lines = document.querySelectorAll('#terminal p')
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerText = text[i] || ''
  }
}

function callMain(event) {
  redraw(osMain(event))
}

function addUnique(list, item) {
  if (!contains(list, item)) {
    list.push(item)
  }
}

function contains(list, item) {
  return list.indexOf(item) >= 0
}

function remove(list, item) {
  var idx = list.indexOf(item)
  if (idx < 0) {
    return
  }
  // duplicate the item in last position to the index
  // of the item we want to remove.
  // Then truncate the list to remove the duplicate item.
  list[idx] = list[list.length - 1]
  list.length = list.length - 1
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
}

startup()
callMain({type: 'boot'})
