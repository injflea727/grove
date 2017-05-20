describe('QuineFilename', function() {
  it('concatenates a name and a formatted date', function() {
    expect(QuineFilename('foo', new Date()).toString())
      .toContain('foo_')

    expect(QuineFilename('bar', new Date()).toString())
      .toContain('bar_')
  })

  it('replaces illegal characters in the name with dashes', function() {
    expect(QuineFilename('foo :,.?_()!bar', new Date()).toString())
      .toContain('foo---.-_---bar_')
  })

  it('allows upper and lowercase letters, numbers, underscores, periods, and dashes', function() {
    expect(QuineFilename('so.name_very-file.W0W', new Date()).toString())
      .toContain('so.name_very-file.W0W_')
  })

  it('appends the date and time in YYYY-MM-DD_HH-MM-SS format', function() {
    expect(QuineFilename('foo', new Date(0)).toString())
      .toMatch(/^foo_\d{4}-\d\d-\d\d__\d\d-\d\d-\d\d\.html$/)

    expect(QuineFilename('foo', new Date(1513806196001)).toString())
      .toMatch(/^foo_\d{4}-\d\d-\d\d__\d\d-\d\d-\d\d\.html$/)
  })
})
