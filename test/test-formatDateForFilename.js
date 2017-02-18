describe('formatDateForFilename', function() {
  it('returns the date in YYYYMMDD-HHMMSS format', function() {
    var date = new Date('2017-01-02T06:17:20Z')

    expect(formatDateForFilename(date)).toEqual('20170102-061720')
  })
})
