describe('LineBuffer', function() {
  it('assumes an empty string if instantiated with no args', function() {
    expect(LineBuffer().toHTML()).toBe(_64_SPACES)
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

  it('makes the entire line bold', function() {
    var text = 'hello'
    var format = {b: 1}
    var expected
      = '<span class="bold">'
      + 'hello                           '
      + '                                '
      + '</span>'

    expect(LineBuffer(text, format).toHTML()).toBe(expected)
  })

  it('makes the entire line italic', function() {
    var text = 'hello'
    var format = {i: true}
    var expected
      = '<span class="italic">'
      + 'hello                           '
      + '                                '
      + '</span>'

    expect(LineBuffer(text, format).toHTML()).toBe(expected)
  })

  it('makes the entire line underlined', function() {
    var text = 'hello'
    var format = {u: true}
    var expected
      = '<span class="underlined">'
      + 'hello                           '
      + '                                '
      + '</span>'

    expect(LineBuffer(text, format).toHTML()).toBe(expected)
  })

  it('makes the entire line bold and italic', function() {
    var text = 'hello'
    var format = {b: true, i: true}
    var expected
      = '<span class="bold italic">'
      + 'hello                           '
      + '                                '
      + '</span>'

    expect(LineBuffer(text, format).toHTML()).toBe(expected)
  })

  it('formats pasted text', function() {
    var text = 'hello'
    var fmt = {b: true}
    var expected
      = 'hello <span class="bold">world</span>'
      + '                     '
      + '                                '

    expect(LineBuffer(text).paste('world', 6, fmt).toHTML())
      .toBe(expected)
  })

  it('formats text pasted at the beginning of the line', function() {
    var fmt = {b: true}
    var expected
      = '<span class="bold">hello</span>'
      + '                           '
      + '                                '

    expect(LineBuffer().paste('hello', 0, fmt).toHTML())
      .toBe(expected)
  })

  it('formats text pasted over other formatted text', function() {
    var bold   = {b: true}
    var italic = {i: true}
    var expected
      = '<span class="bold">hello</span>'
      + '<span class="bold italic">world</span>'
      + '<span class="bold">'
      + '                      '
      + '                                </span>'

    var actual = LineBuffer('hello', bold)
      .paste('world', 5, italic)
      .toHTML()

    expect(actual).toBe(expected)
  })

  it('formats escaped characters correctly', function() {
    var bold = {b: true}
    var expected
      = 'a<span class="bold">&amp;</span>b'
      + '                                '
      + '                             '

    var actual = LineBuffer('a&b')
      .paste('&', 1, bold)
      .toHTML()

    expect(actual).toBe(expected)
  })

  it('performance benchmark', function() {
    var t0 = +new Date()
    Array(32000).map(function() {
      return LineBuffer('foo')
        .paste('bar', 3, {b: 1})
        .paste('baz', 6, {i: 1})
        .paste('foo', 9, {u: 1})
        .paste('bar', 12)
        .paste('baz', 15, {b: 1})
    }).map(function(buffer) {
      return buffer.toHTML()
    })

    var t1 = +new Date()
    console.log('LineBuffer took ' + (t1 - t0) + 'ms')
  })

  it('adds a type property to instances', function() {
    expect(LineBuffer().type).toBe(LineBuffer.type)
    expect(LineBuffer().type).toBe(LineBuffer().type)
    expect(LineBuffer().type).toBeDefined()
  })
})

describe('edges', function() {
  it('returns an empty list given an empty list', function() {
    expect(edges([])).toEqual([])
  })

  it('returns an empty list given a list where every element is the same', function() {
    expect(edges([1,1,1])).toEqual([])
  })

  it('returns the index of an edge in the list', function() {
    expect(edges([1,2])).toEqual([1])
  })

  it('returns the indices of multiple edges in the list', function() {
    expect(edges([1,1,2,2,1])).toEqual([2,4])
  })
})

describe('splitAtIndices', function() {
  it('works for an empty list of indices', function() {
    expect(splitAtIndices([], '')).toEqual([''])
    expect(splitAtIndices([], 'foo')).toEqual(['foo'])
  })

  it('splits at index 1', function() {
    expect(splitAtIndices([1], 'foo')).toEqual(['f', 'oo'])
  })

  it('splits at multiple indices', function() {
    expect(splitAtIndices([1, 2], 'foo')).toEqual(['f', 'o', 'o'])
  })
})
