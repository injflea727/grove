describe('getComputerName', function() {
  it('returns "grove" when no name is set', function() {
    expect(getComputerName({})).toBe('grove')
  })

  it('returns the value in system/name', function() {
    var records = {
      'system/name' : 'custom name'
    }
    expect(getComputerName(records)).toBe('custom name')
  })
})
