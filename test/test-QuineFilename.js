describe('QuineFilename', function() {
  it('concatenates a name and a formatted date', function() {
    expect(QuineFilename('foo', new Date(0)).toString())
      .toBe('foo_1970-01-01_00-00-00')

    expect(QuineFilename('bar', new Date(1000)).toString())
      .toBe('bar_1970-01-01_00-00-01')
  })

  it('replaces illegal characters in the name with dashes', function() {
    expect(QuineFilename('foo :,.?_()!bar', new Date(0)).toString())
      .toBe('foo---.-_---bar_1970-01-01_00-00-00')
  })

  it('allows upper and lowercase letters, numbers, underscores, periods, and dashes', function() {
    expect(QuineFilename('so.name_very-file.W0W', new Date(0)).toString())
      .toBe('so.name_very-file.W0W_1970-01-01_00-00-00')
  })
})
