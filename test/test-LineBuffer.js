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

  it('outputs a line of 64 spaces given an empty string', function() {
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
})
