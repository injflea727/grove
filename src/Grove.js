function Grove (files, printScreen) {
  return {
    turnOn: turnOn
  }

  function turnOn() {
    if (files['system/startup.js']) {
      try {
        var main = eval(files['system/startup.js'] + ';main')
        printScreen([main()])
      } catch(e) {
        printScreen([
          'An error occurred while starting up:',
          e.toString()
        ])
      }
    } else {
      printScreen(['Tried to read from system/startup.js, but there is no such entry'])
    }
  }
}
