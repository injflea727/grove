
document.getElementById('slot').addEventListener('click', function() {
  document.getElementById('files').innerText =
    'var FILES = ' + JSON.stringify(FILES)

  var pageData = document.documentElement.outerHTML
  var blob = new Blob([pageData], {type: 'text/html'})
  saveAs(blob, 'saved.html')
})

var state = {
  __SYSTEM__: {
    keyboard: {
      lastKeyPressed: null,
      keysHeld: []
    },
    screen: [],
    random: Math.random(),
    now: new Date(),
    files: FILES
  }
}

window.addEventListener('keydown', function(event) {
  var kb = state.__SYSTEM__.keyboard
  var keyCode = event.keyCode

  if (contains(kb.keysHeld, keyCode)) {
    return
  }

  kb.lastKeyPressed = keyCode
  addUnique(kb.keysHeld, keyCode)
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

function redraw() {
  var lines = document.querySelectorAll('#terminal p')
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerText = state.__SYSTEM__.screen[i] || ''
  }
}

function callMain(event) {
  state.__SYSTEM__.random = Math.random()
  state.__SYSTEM__.now = new Date()
  state = main(state, event)
  redraw()
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

function main(state, event) {
  try {
    var bootjs = FILES['system/boot.js']

    if (typeof bootjs === 'undefined') {
      throw new Error('Tried to read from system/boot.js, but there is no such file')
    }

    bootjs = '(function() { var main; return (function() {' + bootjs + ';return main})()})()'

    var osMain = eval(bootjs)
    if (typeof osMain !== 'function') {
      throw new Error('system/boot.js needs to define a `main` function.')
    }
    state.__SYSTEM__.screen = osMain(state, event).screen
    return state
  } catch(e) {
    state.__SYSTEM__.screen = [
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

    return state
  }
}

callMain({type: 'boot'})
