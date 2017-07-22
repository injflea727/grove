describe('LineBuffer', function() {
  it('assumes an empty string if instantiated with no args', function() {
    expect(LineBuffer().toHTML()).toBe(_64_SPACES)
  })

  it('stringifies numeric inputs', function() {
    var expected
      = '0                               '
      + '                                '

    expect(LineBuffer(0).toHTML()).toBe(expected)
  })

  it('stringifies null inputs', function() {
    var expected
      = 'null                            '
      + '                                '

    expect(LineBuffer(null).toHTML()).toBe(expected)
  })

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
})
