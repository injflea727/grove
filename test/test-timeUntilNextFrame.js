describe('timeUntilNextFrame', function() {
  it('returns a number of milliseconds', function() {
    var now = 0
    var fps = 60

    expect(timeUntilNextFrame(now, fps)).toBeCloseTo(16.666666667)
    expect(timeUntilNextFrame(now, 20)).toBeCloseTo(50)
  })

  it('quantizes so that the first frame falls exactly on T=0', function() {
    expect(timeUntilNextFrame(15, 60)).toBeCloseTo(1.6666666667)
    expect(timeUntilNextFrame(17, 60)).toBeCloseTo(16.333333333)

    expect(timeUntilNextFrame(49, 20)).toBeCloseTo(1)
    expect(timeUntilNextFrame(51, 20)).toBeCloseTo(49)
    expect(timeUntilNextFrame(999, 20)).toBeCloseTo(1)
  })

  it('returns the correct time when the current time > 1000 millis', function() {
    expect(timeUntilNextFrame(1001, 60)).toBeCloseTo(15.666666667)
  })
})
