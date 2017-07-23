describe('makeScreenWidth', function() {
  it('assumes an empty string if instantiated with no args', function() {
    expect(makeScreenWidth()).toBe(_64_SPACES)
  })

  it('stringifies numeric inputs', function() {
    var expected
      = '0                               '
      + '                                '

    expect(makeScreenWidth(0)).toBe(expected)
  })

  it('stringifies null inputs', function() {
    var expected
      = 'null                            '
      + '                                '

    expect(makeScreenWidth(null)).toBe(expected)
  })

  it('pads a short line to 64 chars', function() {
    var input = 'asdf'
    var expected
      = 'asdf                            '
      + '                                '

    expect(makeScreenWidth(input)).toBe(expected)
    expect(makeScreenWidth(input).length).toBe(64)
  })

  it('truncates a long line to 64 chars', function() {
    var input
      = '1234567890abcdef1234567890abcdef'
      + '1234567890abcdef1234567890abcdef'
      + 'off the screen'

    var expected
      = '1234567890abcdef1234567890abcdef'
      + '1234567890abcdef1234567890abcdef'

    expect(makeScreenWidth(input)).toBe(expected)
    expect(makeScreenWidth(input).length).toBe(64)
  })

  it('outputs 64 spaces given an empty string', function() {
    var input = ''
    var expected
      = '                                '
      + '                                '

    expect(makeScreenWidth(input)).toBe(expected)
    expect(makeScreenWidth(input).length).toBe(64)
  })
})
