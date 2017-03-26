describe('stringToHTML', function() {
  it('converts the empty string to an empty string', function() {
    expect(stringToHTML('')).toEqual('')
  })

  it('acts as the identity function for a string with no formatting', function() {
    expect(stringToHTML('foo')).toEqual('foo')
  })

  it('escapes HTML special characters', function() {
    expect(stringToHTML('<script>&hacked')).toEqual("&lt;script&gt;&amp;hacked")
  })

  it('wraps a string with a formatting escape sequence in a span', function() {
    expect(stringToHTML('\33whello')).toEqual('<span class="fg-w">hello</span>')
  })

  it('formats a string containing HTML special chars', function() {
    expect(stringToHTML('\33w<>')).toEqual('<span class="fg-w">&lt;&gt;</span>')
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

  it('resets the default foreground color', function() {
    expect(stringToHTML('\33ghello\33xworld')).toEqual('<span class="fg-g">hello</span>world')
  })

  it('resets the default background color', function() {
    expect(stringToHTML('\33Ghello\33Xworld')).toEqual('<span class="bg-g">hello</span>world')
  })

  it('ignores duplicate resets', function() {
    expect(stringToHTML('\33Ghello\33X\33Xworld')).toEqual('<span class="bg-g">hello</span>world')
    expect(stringToHTML('\33ghello\33x\33xworld')).toEqual('<span class="fg-g">hello</span>world')
  })

  it('ignores unnecessary resets', function() {
    expect(stringToHTML('\33ghello\33Xworld')).toEqual('<span class="fg-g">helloworld</span>')
  })

  it('resets the foreground color while keeping the background', function() {
    expect(stringToHTML('\33g\33Bhello\33xworld')).toEqual('<span class="fg-g bg-b">hello</span><span class="bg-b">world</span>')
  })

  it('resets the background color while keeping the foreground', function() {
    expect(stringToHTML('\33G\33bhello\33Xworld')).toEqual('<span class="fg-b bg-g">hello</span><span class="fg-b">world</span>')
  })

  it('ignores invalid color codes', function() {
    expect(stringToHTML('\33?hello')).toEqual('hello')
  })

  it('ignores format codes at the end of a string', function() {
    expect(stringToHTML('hello\33b')).toEqual('hello')
    expect(stringToHTML('hello\33b\33W')).toEqual('hello')
  })

  it('ignores reset codes at the beginning of a string', function() {
    expect(stringToHTML('\33xhello')).toEqual('hello')
    expect(stringToHTML('\33Xhello')).toEqual('hello')
  })
})
