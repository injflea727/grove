describe('stringToHTML', function() {
  it('converts the empty string to an empty string', function() {
    expect(stringToHTML('')).toEqual('')
  })

  it('acts as the identity function for a string with no formatting', function() {
    expect(stringToHTML('foo')).toEqual('foo')
  })

  it('wraps a string with a formatting escape sequence in a span', function() {
    expect(stringToHTML('\33whello')).toEqual('<span class="fg-w">hello</span>')
  })

  it('ignores duplicate escape sequences', function() {
    expect(stringToHTML('\33w\33whello')).toEqual('<span class="fg-w">hello</span>')
  })

  it('uses uppercase format codes to set background color', function() {
    expect(stringToHTML('\33w\33Bhello')).toEqual('<span class="fg-w bg-b">hello</span>')
  })

  it('ignores foreground codes that have no effect', function() {
    expect(stringToHTML('\33w\33bhello')).toEqual('<span class="fg-b">hello</span>')
  })

  it('ignores background codes that have no effect', function() {
    expect(stringToHTML('\33W\33Bhello')).toEqual('<span class="bg-b">hello</span>')
  })

  it('changes between multiple colors', function() {
    expect(stringToHTML('\33ghello\33bworld')).toEqual('<span class="fg-g">hello</span><span class="fg-b">world</span>')
  })

  it('ignores invalid color codes', function() {
    expect(stringToHTML('\33?hello')).toEqual('hello')
  })

  it('ignores format codes at the end of a string', function() {
    expect(stringToHTML('hello\33b')).toEqual('hello')
    expect(stringToHTML('hello\33b\33W')).toEqual('hello')
  })
})
