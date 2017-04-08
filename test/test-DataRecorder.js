describe('DataRecorder', function() {
  var Immutable = require('../src/immutable.js')

  var emptyEntries = Immutable.Map()

  it('lets you read an entry', function() {
    var entries = Immutable.Map({foo: 'bar'})

    expect(DataRecorder(entries).read('foo')).toEqual('bar')
  })

  it('treats nonexistent entries as having empty content', function() {
    var rec = DataRecorder(emptyEntries)

    expect(rec.read('foo')).toEqual('')
  })

  it('lets you write an entry', function() {
    var rec = DataRecorder(emptyEntries)
    var rec1 = rec.write('foo', 'bar')

    expect(rec1.read('foo')).toEqual('bar')
  })

  it('writes entries immutably', function() {
    var rec = DataRecorder(emptyEntries)
    rec.write('foo', 'bar')

    expect(rec.read('foo')).toEqual('')
  })

  it('JSONifies itself', function() {
    var entries = Immutable.Map({
      a: 'b',
      c: 'd'
    })
    var rec = DataRecorder(entries)

    expect(rec.toJSON()).toEqual('{"a":"b","c":"d"}')
  })

  it('lets you delete an entry', function() {
    var entries = Immutable.Map({
      deleteme: 'foo'
    })
    var rec = DataRecorder(entries)

    var rec1 = rec.delete('deleteme')

    expect(rec1.read('deleteme')).toEqual('')
    expect(rec1.toJSON()).toEqual("{}")
  })

  it('deletes entries immutably', function() {
    var entries = Immutable.Map({
      'test subject': 'still alive'
    })
    rec = DataRecorder(entries)

    rec.delete('test subject')

    expect(rec.read('test subject')).toEqual('still alive')
  })

  it('deletes an entry when an empty string is set as the content', function() {
    var entries = Immutable.Map({
      deleteme: 'foo'
    })
    var rec = DataRecorder(entries)

    var rec1 = rec.write('deleteme', '')

    expect(rec1.toJSON()).toEqual("{}")
  })

  it('demands that keys be strings', function() {
    ds = DataRecorder(emptyEntries)
    expect(function() { ds.read({}) })
      .toThrowError("DataRecorder#read expects to be called with a string, but got [object Object]")

    expect(function() { ds.write({}, 'foo') })
      .toThrowError("DataRecorder#write expects to be called with two strings, but got [object Object], foo")
  })

  it('demands that values be strings', function() {
    expect(function() { ds.write('foo', {}) })
      .toThrowError("DataRecorder#write expects to be called with two strings, but got foo, [object Object]")
  })
})
