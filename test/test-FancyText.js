describe('FancyText', function() {
  it('can represent unformattted text', function() {
    var ft = FancyText('foo')
    expect(ft.toString()).toEqual('foo')
  })

  it('escapes HTML special characters', function() {
    var ft = FancyText('<foo>&')
    expect(ft.toString()).toEqual('&lt;foo&gt;&amp;')
  })

  it('can represent formatted text', function() {
    var ft = FancyText('foo', {text: 'blue'})
    expect(ft.toString()).toEqual('<span style="color:blue">foo</span>')
  })

  it('converts non-strings to strings', function() {
    expect(FancyText(1).toString()).toEqual('1')
  })

  it('stringifies nested FancyTexts', function() {
    var ft = FancyText(FancyText('foo', {highlight: 'blue'}), {text: 'red'})
    expect(ft.toString()).toEqual('<span style="color:red"><span style="background-color:blue">foo</span></span>')
  })

  it('appends text to the end', function() {
    var ft = FancyText('foo').append('bar')
    expect(ft.toString()).toEqual('foobar')
  })

  it('appends formatted text', function() {
    var ft = FancyText('foo').append('bar', {text: 'red'})
    expect(ft.toString()).toEqual('foo<span style="color:red">bar</span>')
  })
})

describe('formatObjectToStyleString', function() {
  it('represents text color as CSS', function() {
    expect(formatObjectToStyleString({text: 'blue'})).toEqual('color:blue')
    expect(formatObjectToStyleString({text: 'red'})).toEqual('color:red')
  })

  it('represents highlight color as CSS', function() {
    expect(formatObjectToStyleString({highlight: 'red'})).toEqual('background-color:red')
    expect(formatObjectToStyleString({highlight: 'blue'})).toEqual('background-color:blue')
  })

  it('does both at once', function() {
    expect(formatObjectToStyleString({highlight: 'blue', text: 'red'})).toEqual('color:red;background-color:blue')
  })

  it('converts an empty object to an empty string', function() {
    expect(formatObjectToStyleString({})).toEqual('')
  })
})
