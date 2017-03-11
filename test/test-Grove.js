describe('Grove', function() {
  var lastOutput
  function receiveOutput (output) {
    lastOutput = output
  }

  beforeEach(function() {
    lastOutput = []
  })

  it('initially renders nothing', function() {
    Grove({}, receiveOutput)
    expect(lastOutput).toEqual([])
  })

  it('renders an error when turned on with no files', function() {
    var g = Grove({}, receiveOutput)
    g.turnOn()
    expect(lastOutput).toContain('Tried to read from system/startup.js, but there is no such entry')
  })

  it('renders an error when the startup file has a syntax error', function() {
    var files = {
      'system/startup.js':
        'function ()'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toContain('An error occurred while starting up:')
    expect(lastOutput).toContain('SyntaxError: Unexpected token (')
  })

  it('can be rebooted after an error', function() {
    var files = {
      'system/startup.js':
        'function ()'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toContain('An error occurred while starting up:')

    g.turnOff()
    files['system/startup.js'] = 'function main() { return "it works" }'
    g.turnOn()

    expect(lastOutput).toEqual(['it works'])
  })

  it('renders the output of main() when the startup file is valid', function() {
    var files = {
      'system/startup.js':
        'function main() { return "hello" }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toEqual(['hello'])
  })

  it('does not allow the main() function to access Grove-defined functions', function() {
    var files = {
      'system/startup.js':
        'function main() { return Grove().toString() }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toContain('An error occurred while starting up:')
    expect(lastOutput).toContain('TypeError: Grove is not a function')
  })

  it('does not allow the main() function to access global functions', function() {
    var files = {
      'system/startup.js':
        'function main() { return setTimeout().toString() }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toContain('An error occurred while starting up:')
    expect(lastOutput).toContain('TypeError: setTimeout is not a function')
  })

  it('escapes HTML in data output from main()', function() {
    var files = {
      'system/startup.js':
        'function main() { return "<script>hacked&" }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toEqual(['&lt;script&gt;hacked&amp;'])
  })

  it('allows main() to format text using FancyText', function() {
    var files = {
      'system/startup.js':
        'function main() { return T("hello", {text: "blue", highlight: "green"}) }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toEqual(['<span style="color:blue;background-color:green">hello</span>'])
  })

  it('allows main() to return output as an array', function() {
    var files = {
      'system/startup.js':
        'function main() { return ["line 1", "line 2"] }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toEqual(['line 1', 'line 2'])
  })

  it('allows main() to return output as an object with a "screen" property', function() {
    var files = {
      'system/startup.js':
        'function main() { return {screen: "foo"} }'
    }
    var g = Grove(files, receiveOutput)
    g.turnOn()
    expect(lastOutput).toEqual(['foo'])
  })

  it('has a name, read from system/name', function() {
    var files = {
      'system/name': 'custom name'
    }
    var g = Grove(files, receiveOutput)
    expect(g.getName()).toBe('custom name')
  })

  it('uses "grove" as the default name', function() {
    var files = {
    }
    var g = Grove(files, receiveOutput)
    expect(g.getName()).toBe('grove')
  })
})
