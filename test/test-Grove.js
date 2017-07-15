describe('Grove', function() {
  var actions

  function lastOutput() {
    return actions.redraw.calls.mostRecent().args[0]
  }

  beforeEach(function() {
    actions = jasmine.createSpyObj([
      'redraw',
      'notifyOfDataRecordChange',
      'openUrl',
      'displayInNewWindow'
    ])
    jasmine.clock().install()
  })

  afterEach(function() {
    jasmine.clock().uninstall()
  })

  it('renders help text when there are no records', function() {
    var g = Grove({}, actions)
    expect(actions.redraw.calls.mostRecent().args[0][0])
      .toContain("Grove")

    expect(actions.redraw.calls.mostRecent().args[0][2])
      .toContain("no operating system installed yet")
  })

  it('does not react to keypresses when booting is not successful', function() {
    var g = Grove({}, actions)
    g.handleKeyDown({keyCode: 32})
    expect(actions.redraw.calls.mostRecent().args[0][0])
      .toContain('Grove')
  })

  it('renders an error when the startup record has a syntax error', function() {
    var records = {
      'startup':
        'function ()'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('An error occurred while starting up:')
    expect(lastOutput()[1]).toContain('SyntaxError: Unexpected token (')
  })

  it('renders the output of main() when the startup record is valid', function() {
    var records = {
      'startup':
        'function main() { return "hello" }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('hello')
  })

  it('does not allow the main() function to access Grove-defined functions', function() {
    var records = {
      'startup':
        'function main() { return Grove().toString() }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('The system encountered an error:')
    expect(lastOutput()[1]).toContain('TypeError: Grove is not a function')
  })

  it('does not allow the main() function to access global functions', function() {
    var records = {
      'startup':
        'function main() { return setTimeout().toString() }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('The system encountered an error:')
    expect(lastOutput()[1]).toContain('TypeError: setTimeout is not a function')
  })

  it('escapes HTML in data output from main()', function() {
    var records = {
      'startup':
        'function main() { return "<script>hacked&" }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('&lt;script&gt;hacked&amp;')
  })

  it('allows main() to return output as an array', function() {
    var records = {
      'startup':
        'function main() { return ["line 1", "line 2"] }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('line 1')
    expect(lastOutput()[1]).toContain('line 2')
  })

  it('allows main() to return output as an object with a "screen" property', function() {
    var records = {
      'startup':
        'function main() { return {screen: "foo"} }'
    }
    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('foo')
  })

  it('outputs the recordsystem state as json', function() {
    var records = { foo: 'bar' }
    var g = Grove(records, actions)
    expect(g.getDataAsJSON()).toEqual('{"foo":"bar"}')
  })

  it('passes the key code to main() when a key is pressed', function() {
    var records = {
      'startup':
        'function main(evt) { return evt.type + ": " + evt.key }'
    }
    var g = Grove(records, actions)

    expect(lastOutput()[0]).toContain('startup: undefined')
    g.handleKeyDown({keyCode: 32})

    expect(lastOutput()[0]).toContain('keyDown: 32')

    g.handleKeyDown({keyCode: 65})

    expect(lastOutput()[0]).toContain('keyDown: 65')
  })

  it('does not register duplicate key presses with no intervening key release', function() {
    // this is important because the browser will send repeated
    // keydown events when a key is held.
    var records = {
      'startup':
        'var count = 0; function main(evt) { return "" + (count++) }'
    }
    var g = Grove(records, actions)

    g.handleKeyDown({keyCode: 32})
    g.handleKeyDown({keyCode: 32})

    expect(lastOutput()[0]).toContain('1')
  })

  it('does register a key press after the key is released', function() {
    // this is important because the browser will send repeated
    // keydown events when a key is held.
    var records = {
      'startup':
        'var count = 0; function main(evt) { return "" + (count++) }'
    }
    var g = Grove(records, actions)

    g.handleKeyDown({keyCode: 32})
    g.handleKeyUp({keyCode: 32})
    g.handleKeyDown({keyCode: 32})

    expect(lastOutput()[0]).toContain('3')
  })

  it('passes the key code to main() when a key is released', function() {
    var records = {
      'startup':
        'function main(evt) { return evt.type + ": " + evt.key }'
    }
    var g = Grove(records, actions)

    expect(lastOutput()[0]).toContain('startup: undefined')
    g.handleKeyUp({keyCode: 32})

    expect(lastOutput()[0]).toContain('keyUp: 32')
  })

  it('renders error messages thrown by events', function() {
    var records = {
      'startup':
        'function main(evt) { if (evt.type === "keyDown") throw "kablooie"; return "ok" }'
    }
    var g = Grove(records, actions)

    expect(function() { g.handleKeyDown({keyCode: 32}) })
      .not.toThrow()

    expect(lastOutput()[0]).toContain('The system encountered an error:')
    expect(lastOutput()[1]).toContain('kablooie')
  })

  it('does not respond to events after throwing an error', function() {
    // this ensures that the user is able to see the error
    // and take a screenshot.
    var records = {
      'startup':
        'function main(evt) { if (evt.type === "keyDown") throw "kablooie"; return "ok" }'
    }
    var g = Grove(records, actions)
    g.handleKeyDown({keyCode: 32})
    g.handleKeyUp({keyCode: 32})

    expect(lastOutput()[1]).toContain('kablooie')
  })

  it('allows main() to read and write data records', function() {
    var records = {
      'startup':
        'function main(event, data) { '
        + 'var count = +data.read("count") || 0;'
        + 'return {'
        + '  screen: count,'
        + '  records: {"count": "" + (count+1)}'
        + '} }'
    }

    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('0')
    g.handleKeyDown({keyCode: 65})
    expect(lastOutput()[0]).toContain('1')

    expect(JSON.parse(g.getDataAsJSON()).count).toBe('2')
  })

  it('allows main() to open a URL in a new tab', function() {
    var records = {
      'startup':
        'function main(event, data) {'
        + 'return {'
        + '  url: "https://example.com"'
        + '} }'
    }

    var g = Grove(records, actions)

    expect(actions.openUrl)
      .toHaveBeenCalledWith('https://example.com')
  })

  it('allows main() to display text or HTML in a new tab', function() {
    var records = {
      'startup':
        'function main(event, data) {'
        + 'return {'
        + '  print: "so message, very text"'
        + '} }'
    }

    var g = Grove(records, actions)

    expect(actions.displayInNewWindow)
      .toHaveBeenCalledWith('so message, very text')
  })

  it('does not display anything in a new tab when no "print" output is given', function() {
    var records = {
      'startup':
        'function main(event, data) {'
        + 'return {'
        + '  screen: "whatever"'
        + '} }'
    }

    var g = Grove(records, actions)

    expect(actions.displayInNewWindow)
      .not.toHaveBeenCalled()
  })

  it('notifies listeners of data record changes', function() {
    var records = {
      'startup':
        'function main(event, data) { '
        + 'var count = +data.read("count") || 0;'
        + 'return {'
        + '  screen: count,'
        + '  records: {"count": "" + (count+1)}'
        + '} }'
    }

    var g = Grove(records, actions)
    expect(actions.notifyOfDataRecordChange)
      .toHaveBeenCalledWith('count', '1')

    g.handleKeyDown({keyCode: 65})

    expect(actions.notifyOfDataRecordChange)
      .toHaveBeenCalledWith('count', '2')
  })

  it('calls main() for every frame of animation', function() {
    var records = {
      'startup':
        'var calls = 0;'
        + 'function main(event) { '
        + 'return "" + (calls++)'
        + '}'
    }

    var g = Grove(records, actions)
    g.handleClock()
    expect(lastOutput()[0]).toContain(1)
    g.handleClock()
    expect(lastOutput()[0]).toContain(2)
  })

  it('does not re-render if main() returns null', function() {
    var records = {
      'startup': 'var c=0; function main() { if(!c++) return "hello"; return null }'
    }

    var g = Grove(records, actions)
    expect(lastOutput()[0]).toContain('hello')
    g.handleClock()
    expect(lastOutput()[0]).toContain('hello')
  })
})
