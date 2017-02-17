describe('formatLineAsHtml', function() {
  it('passes plain text through unchanged', function() {
    expect(formatLineAsHtml('foo')).toBe('foo')
    expect(formatLineAsHtml('bar')).toBe('bar')
  })

  it('escapes HTML in the input', function() {
    expect(formatLineAsHtml('<foo>&')).toBe('&lt;foo&gt;&amp;')
  })

  it('adds spans for format objects', function() {
    expect(formatLineAsHtml([{color: 'red', text: 'foo'}]))
      .toBe('<span style="color:red">foo</span>')

    expect(formatLineAsHtml([{color: 'blue', text: 'bar'}]))
      .toBe('<span style="color:blue">bar</span>')
  })

  it('html-escapes text in format objects', function() {
    expect(formatLineAsHtml([{color: 'red', text: '<foo>'}]))
      .toBe('<span style="color:red">&lt;foo&gt;</span>')
  })

  it('handles multiple format objects', function() {
    expect(formatLineAsHtml([{color: 'red', text: 'foo'}, {color: 'blue', text: 'bar'}]))
      .toBe('<span style="color:red">foo</span><span style="color:blue">bar</span>')
  })

  it('combines format objects with plain text', function() {
    expect(formatLineAsHtml(['hello ', {color: 'blue', text: 'world'}]))
      .toBe('hello <span style="color:blue">world</span>')
  })

  it('does not create spans for objects with no `color` property', function() {
    expect(formatLineAsHtml(['hello ', {text: 'world'}]))
      .toBe('hello world')

    expect(formatLineAsHtml(['hello ', {text: '<>'}]))
      .toBe('hello &lt;&gt;')
  })
})
