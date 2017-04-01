describe('LineBuffer', function() {
  it('pads a short line to 64 chars', function() {
    var input = 'asdf'
    var expected
      = 'asdf                            '
      + '                                '

    expect(LineBuffer(input).toHTML()).toBe(expected)
    expect(LineBuffer(input).toHTML().length).toBe(64)
  })

  it('truncates a long line to 64 chars', function() {
    var input
      = '1234567890abcdef1234567890abcdef'
      + '1234567890abcdef1234567890abcdef'
      + 'off the screen'

    var expected
      = '1234567890abcdef1234567890abcdef'
      + '1234567890abcdef1234567890abcdef'

    expect(LineBuffer(input).toHTML()).toBe(expected)
    expect(LineBuffer(input).toHTML().length).toBe(64)
  })

  it('outputs 64 spaces given an empty string', function() {
    var input = ''
    var expected
      = '                                '
      + '                                '

    expect(LineBuffer(input).toHTML()).toBe(expected)
    expect(LineBuffer(input).toHTML().length).toBe(64)
  })

  it('escapes HTML special characters', function() {
    var input = '<&>'
    var expected
      = '&lt;&amp;&gt;'
      + '                             '
      + '                                '

    expect(LineBuffer(input).toHTML()).toBe(expected)
  })

  it('pastes text at the beginning', function() {
    var initial = 'world world'
    var expected
      = 'hello world                     '
      + '                                '

    expect(LineBuffer(initial).paste('hello').toHTML())
      .toBe(expected)

    expect(LineBuffer(initial).paste('hello', 0).toHTML())
      .toBe(expected)
  })

  it('pastes text in the middle', function() {
    var initial = 'hello hello'
    var expected
      = 'hello world                     '
      + '                                '

    expect(LineBuffer(initial).paste('world', 6).toHTML())
      .toBe(expected)
  })

  it('pastes text at the end', function() {
    var initial = 'hello'
    var toPaste = 'world off the screen'
    var expected
      = 'hello                           '
      + '                           world'

    expect(LineBuffer(initial).paste(toPaste, 59).toHTML())
      .toBe(expected)
  })

  it('pastes text beyond the end', function() {
    var initial = 'hello'
    var toPaste = 'off the screen'
    var expected
      = 'hello                           '
      + '                                '

    expect(LineBuffer(initial).paste(toPaste, 64).toHTML())
      .toBe(expected)

    expect(LineBuffer(initial).paste(toPaste, 65).toHTML())
      .toBe(expected)
  })
})
