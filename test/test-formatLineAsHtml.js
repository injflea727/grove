describe('formatLineAsHtml', function() {
  it('passes plain text through unchanged', function() {
    expect(formatLineAsHtml('foo')).toBe('foo')
    expect(formatLineAsHtml('bar')).toBe('bar')
  })
})
