/**
 * This class exposes the actions that the Grove (which runs
 * in a Web Worker) can take to affect the main browser
 * window.
 *
 * It is injected into Grove instances.
 */
function BrowserController(workerGlobal) {

  // --- Public API declaration ----------------------------

  return {
    redraw: redraw,
    openUrl: openUrl,
    notifyOfDataRecordChange: notifyOfDataRecordChange
  }

  // --- Public function definitions -----------------------

  function redraw(trustedHTMLLines) {
    workerGlobal.postMessage({
      type: 'redraw',
      value: trustedHTMLLines
    })
  }

  function openUrl(url) {
    workerGlobal.postMessage({
      type: 'openUrl',
      url: url
    })
  }

  function notifyOfDataRecordChange(name, content) {
    workerGlobal.postMessage({
      type: 'dataRecordChange',
      name: name,
      content: content
    })
  }
}
