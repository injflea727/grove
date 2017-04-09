var Immutable = require('../src/immutable')

describe('Grove', function() {
  var receiveOutput = jasmine.createSpy('receiveOutput')
  var handleDataChange = jasmine.createSpy('handleDataChange')

  function lastOutput() {
    return receiveOutput.calls.mostRecent().args[0]
  }

  it('renders an error when there are no files', function() {
    var g = Grove({}, receiveOutput)
    expect(receiveOutput).toHaveBeenCalledWith(['Tried to read from system/startup.js, but there is no such entry'])
  })

  it('does not react to keypresses when booting is not successful', function() {
    var g = Grove({}, receiveOutput)
    g.handleKeyDown({keyCode: 32})
    expect(receiveOutput.calls.mostRecent().args[0])
      .toEqual(['Tried to read from system/startup.js, but there is no such entry'])
  })

  it('renders an error when the startup file has a syntax error', function() {
    var files = {
      'system/startup.js':
        'function ()'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()).toContain('An error occurred while starting up:')
    expect(lastOutput()).toContain('SyntaxError: Unexpected token (')
  })

  it('renders the output of main() when the startup file is valid', function() {
    var files = {
      'system/startup.js':
        'function main() { return "hello" }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('hello')
  })

  it('does not allow the main() function to access Grove-defined functions', function() {
    var files = {
      'system/startup.js':
        'function main() { return Grove().toString() }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()).toContain('An error occurred while starting up:')
    expect(lastOutput()).toContain('TypeError: Grove is not a function')
  })

  it('does not allow the main() function to access global functions', function() {
    var files = {
      'system/startup.js':
        'function main() { return setTimeout().toString() }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()).toContain('An error occurred while starting up:')
    expect(lastOutput()).toContain('TypeError: setTimeout is not a function')
  })

  it('escapes HTML in data output from main()', function() {
    var files = {
      'system/startup.js':
        'function main() { return "<script>hacked&" }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('&lt;script&gt;hacked&amp;')
  })

  it('allows main() to format text with LineBuffer', function() {
    var files = {
      'system/startup.js':
        'function main() { '
        + 'return LineBuffer().paste("hello", 0, {b: 1})'
        + '}'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('<span class="bold">hello</span>')
  })

  it('allows main() to return output as an array', function() {
    var files = {
      'system/startup.js':
        'function main() { return ["line 1", "line 2"] }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('line 1')
    expect(lastOutput()[1]).toContain('line 2')
  })

  it('allows main() to return output as an object with a "screen" property', function() {
    var files = {
      'system/startup.js':
        'function main() { return {screen: "foo"} }'
    }
    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('foo')
  })

  it('has a name, read from system/name', function() {
    var files = {
      'system/name': 'custom name'
    }
    var g = Grove(files, receiveOutput)
    expect(g.getName()).toBe('custom name')
  })

  it('uses "grove" as the default name', function() {
    var files = {}
    var g = Grove(files, receiveOutput)
    expect(g.getName()).toBe('grove')
  })

  it('outputs the filesystem state as json', function() {
    var files = { foo: 'bar' }
    var g = Grove(files, receiveOutput)
    expect(g.getDataAsJSON()).toEqual('{"foo":"bar"}')
  })

  it('passes the key code to main() when a key is pressed', function() {
    var files = {
      'system/startup.js':
        'function main(evt) { return evt.type + ": " + evt.key }'
    }
    var g = Grove(files, receiveOutput)

    expect(lastOutput()[0]).toContain('startup: undefined')
    g.handleKeyDown({keyCode: 32})

    expect(lastOutput()[0]).toContain('keyDown: 32')
  })

  it('passes the key code to main() when a key is released', function() {
    var files = {
      'system/startup.js':
        'function main(evt) { return evt.type + ": " + evt.key }'
    }
    var g = Grove(files, receiveOutput)

    expect(lastOutput()[0]).toContain('startup: undefined')
    g.handleKeyUp({keyCode: 32})

    expect(lastOutput()[0]).toContain('keyUp: 32')
  })

  it('allows main() to read and write data records', function() {
    var files = {
      'system/startup.js':
        'function main(event, data) { '
        + 'var count = +data.read("count") || 0;'
        + 'return {'
        + '  screen: count,'
        + '  records: {"count": "" + (count+1)}'
        + '} }'
    }

    var g = Grove(files, receiveOutput)
    expect(lastOutput()[0]).toContain('0')
    g.handleKeyDown({keyCode: 65})
    expect(lastOutput()[0]).toContain('1')

    expect(JSON.parse(g.getDataAsJSON()).count).toBe('2')
  })

  it('notifies listeners of data record changes', function() {
    var files = {
      'system/startup.js':
        'function main(event, data) { '
        + 'var count = +data.read("count") || 0;'
        + 'return {'
        + '  screen: count,'
        + '  records: {"count": "" + (count+1)}'
        + '} }'
    }

    var g = Grove(files, receiveOutput, handleDataChange)
    expect(handleDataChange).toHaveBeenCalledWith('count', '1')
    g.handleKeyDown({keyCode: 65})
    expect(handleDataChange).toHaveBeenCalledWith('count', '2')
  })
})
