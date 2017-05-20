describe('getComputerName', function() {
  it('returns "grove" when no name is set', function() {
    expect(getComputerName({})).toBe('grove')
  })

  it('returns the value in the `name` record', function() {
    var records = {
      'name' : 'custom name'
    }
    expect(getComputerName(records)).toBe('custom name')
  })
})
