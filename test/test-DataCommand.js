describe('DataCommand', function() {
  it('creates a noop command', function() {
    var rec = DataRecorder({})
    var initialJSON = rec.toJSON()
    DataCommand.noop().exec(rec)

    expect(rec.toJSON()).toEqual(initialJSON)
  })

  it('merges two noop commands', function() {
    var rec = DataRecorder({})
    var initialJSON = rec.toJSON()

    DataCommand.noop()
      .and(DataCommand.noop())
      .exec(rec)

    expect(rec.toJSON()).toEqual(initialJSON)
  })

  it('can exec multiple times', function() {
    var rec = DataRecorder({})
    var initialJSON = rec.toJSON()
    DataCommand.noop().exec(rec).exec(rec)
  })

  it('creates a write command', function() {
    var rec = DataRecorder({})
    DataCommand.write('foo', 'bar').exec(rec)
    expect(rec.read('foo')).toBe('bar')
  })

  it('merges two write commands', function() {
    var rec = DataRecorder({})
    DataCommand.write('foo', 'bar')
      .and(DataCommand.write('baz', 'qux'))
      .exec(rec)
    expect(rec.read('foo')).toBe('bar')
    expect(rec.read('baz')).toBe('qux')
  })

  it('merges three write commands', function() {
    var rec = DataRecorder({})
    DataCommand.write('foo', 'bar')
      .and(DataCommand.write('foo', 'qux'))
      .and(DataCommand.write('foo', 'zif'))
      .exec(rec)
    expect(rec.read('foo')).toBe('zif')
  })

  it('merges a write and a noop', function() {
    var rec = DataRecorder({})

    DataCommand.write('foo', 'bar')
      .and(DataCommand.noop())
      .exec(rec)

    expect(rec.read('foo')).toBe('bar')

    DataCommand.noop()
      .and(DataCommand.write('foo', 'zif'))
      .exec(rec)

    expect(rec.read('foo')).toBe('zif')
  })
})
