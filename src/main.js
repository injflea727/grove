// assert that necessary globals exist
if (typeof Immutable !== 'object') throw 'immutable.js not found'
if (typeof FILES !== 'object') throw 'FILES global not found'

var $ = document.querySelectorAll.bind(document)

var osMain = function() {
  return 'If you can read this, something broke.'
}

$('#slot')[0].addEventListener('click', function() {
  $('#files')[0].innerText =
    'var FILES = ' + JSON.stringify(FILES)

  var pageData = document.documentElement.outerHTML
  var blob = new Blob([pageData], {type: 'text/html'})
  saveAs(blob, 'saved.html')
})

var overlay = $('#overlay')[0]
$('#file-modal .close-button button')[0]
  .addEventListener('click', function() {
    overlay.style.display = 'none';
  })

$('#data-editor-button')[0]
  .addEventListener('click', function() {
    overlay.style.display = 'block';
  })

var fileNameInput = $('#file-modal .file-selector input')[0]
var fileContentInput = $('#file-modal textarea')[0]
$('#file-modal .save')[0]
  .addEventListener('click', function() {
    console.log('saving file', fileNameInput.value, fileContentInput.value)
    var filename = fileNameInput.value
    if (!filename) return
    FILES[filename] = fileContentInput.value
  })

function redraw(text) {
  var lines = $('#terminal p')
  for (var i = 0; i < lines.length; i++) {
    lines[i].innerText = text[i] || ''
  }
}

function callMain(event) {
  redraw(osMain(event))
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
