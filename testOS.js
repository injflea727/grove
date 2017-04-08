/* sample OS to test that the Grove is working */
var keys = {}
function main(event, dataRecorder) {
  if (event.type === 'keyDown') {
    keys[event.key] = true
  }

  if (event.type === 'keyUp') {
    delete keys[event.key]
  }

  return dataRecorder.read('system/startup.js').split('\n')
    .concat(Object.keys(keys))
}
