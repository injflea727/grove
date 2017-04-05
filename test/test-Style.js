describe('Style', function() {
  it('represents plain unformatted text', function() {
    expect(Style({}).toHTMLClasses()).toBe('')
    expect(Style().toHTMLClasses()).toBe('')
  })

  it('represents bold text formatting', function() {
    expect(Style({b: 1}).toHTMLClasses()).toBe('bold')
  })

  it('represents italic text formatting', function() {
    expect(Style({i: 1}).toHTMLClasses()).toBe('italic')
  })

  it('represents underlined text formatting', function() {
    expect(Style({u: 1}).toHTMLClasses()).toBe('underlined')
  })

  it('represents combinations of formatting', function() {
    expect(Style({i: 1, b: 1}).toHTMLClasses())
      .toBe('bold italic')

    expect(Style({u: 1, b: 1}).toHTMLClasses())
      .toBe('bold underlined')

    expect(Style({i: 1, u: 1}).toHTMLClasses())
      .toBe('italic underlined')

    expect(Style({i: 1, u: 1, b: 1}).toHTMLClasses())
      .toBe('bold italic underlined')
  })

  it('overlays another style', function() {
    expect(Style({u: 1}).overlay({b: 1}).toHTMLClasses())
      .toBe('bold underlined')
  })

  it('overlays the absence of a style', function() {
    expect(Style({b: 1}).overlay({b: 0}).toHTMLClasses())
      .toBe('')
  })

  it('represents foreground colors', function() {
    expect(Style({fg: 'red'}).toHTMLClasses())
      .toBe('fg-red')
  })

  it('represents background colors', function() {
    expect(Style({bg: 'red'}).toHTMLClasses())
      .toBe('bg-red')
  })

  it('overlays foreground and background colors', function() {
    var classes
      = Style({bg: 'red'})
      .overlay({fg: 'blue'})
      .toHTMLClasses()

    expect(classes).toBe('fg-blue bg-red')
  })
})
