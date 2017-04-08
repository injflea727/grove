describe('DataRecorder', function() {
  it('lets you read an entry', function() {
    expect(DataRecorder({foo: 'bar'}).read('foo')).toEqual('bar')
  })

  it('treats nonexistent entries as having empty content', function() {
    var rec = DataRecorder({})

    expect(rec.read('foo')).toEqual('')
  })

  it('lets you write an entry', function() {
    var rec = DataRecorder({})
    rec.write('foo', 'bar')

    expect(rec.read('foo')).toEqual('bar')
  })

  it('notifies a listener on write', function() {
    var listener = jasmine.createSpy('listener')
    var rec = DataRecorder({}, listener)
    rec.write('foo', 'bar')

    expect(listener).toHaveBeenCalledWith('foo', 'bar')
  })

  it('JSONifies itself', function() {
    var entries = Immutable.Map({
      a: 'b',
      c: 'd'
    })
    var rec = DataRecorder(entries)

    expect(rec.toJSON()).toEqual('{"a":"b","c":"d"}')
  })

  it('deletes an entry when an empty string is set as the content', function() {
    var entries = {deleteme: 'foo'}
    var rec = DataRecorder(entries)

    rec.write('deleteme', '')

    expect(rec.toJSON()).toEqual("{}")
  })

  it('demands that keys be strings', function() {
    var rec = DataRecorder({})
    expect(function() { rec.read({}) })
      .toThrowError("DataRecorder#read expects to be called with a string, but got [object Object]")

    expect(function() { rec.write({}, 'foo') })
      .toThrowError("DataRecorder#write expects to be called with two strings, but got [object Object], foo")
  })

  it('demands that values be strings', function() {
    var rec = DataRecorder({})
    expect(function() { rec.write('foo', {}) })
      .toThrowError("DataRecorder#write expects to be called with two strings, but got foo, [object Object]")
  })
})
