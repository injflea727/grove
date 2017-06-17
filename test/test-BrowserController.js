describe('BrowserController', function() {
  var workerGlobal
  var controller

  beforeEach(function() {
    workerGlobal = jasmine.createSpyObj(['postMessage'])
    controller = BrowserController(workerGlobal)
  })

  describe('notifyOfDataRecordChange', function() {
    it('posts a message to the browser window', function() {
      controller.notifyOfDataRecordChange(
        'record name',
        'record content')

      expect(workerGlobal.postMessage)
        .toHaveBeenCalledWith({
          type: 'dataRecordChange',
          name: 'record name',
          content: 'record content'
        })
    })
  })

  describe('redraw', function() {
    it('posts a message to the browser window', function() {
      controller.redraw('dummy')

      expect(workerGlobal.postMessage)
        .toHaveBeenCalledWith({
          type: 'redraw',
          value: 'dummy'
        })
    })
  })

  describe('openUrl', function() {
    it('posts a message to the browser window', function() {
      controller.openUrl('https://example.com')

      expect(workerGlobal.postMessage)
        .toHaveBeenCalledWith({
          type: 'openUrl',
          url: 'https://example.com'
        })
    })
  })

  describe('displayInNewWindow', function() {
    it('posts a message to the browser window', function() {
      controller.displayInNewWindow('hello, world!')

      expect(workerGlobal.postMessage)
        .toHaveBeenCalledWith({
          type: 'displayInNewWindow',
          content: 'hello, world!'
        })
    })
  })
})
