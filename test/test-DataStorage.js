describe('DataStorage', function() {
  var Immutable = require('../src/immutable.js')

  var emptyEntries = Immutable.Map()

  it('lets you read an entry', function() {
    var entries = Immutable.Map({foo: 'bar'})

    expect(DataStorage(entries).read('foo')).toEqual('bar')
  })

  it('treats nonexistent entries as having empty content', function() {
    var ds = DataStorage(emptyEntries)

    expect(ds.read('foo')).toEqual('')
  })

  it('lets you write an entry', function() {
    var ds = DataStorage(emptyEntries)
    var ds1 = ds.write('foo', 'bar')

    expect(ds1.read('foo')).toEqual('bar')
  })

  it('writes entries immutably', function() {
    var ds = DataStorage(emptyEntries)
    ds.write('foo', 'bar')

    expect(ds.read('foo')).toEqual('')
  })

  it('JSONifies itself', function() {
    var entries = Immutable.Map({
      a: 'b',
      c: 'd'
    })
    var ds = DataStorage(entries)

    expect(ds.toJSON()).toEqual('{"a":"b","c":"d"}')
  })

  it('lets you delete an entry', function() {
    var entries = Immutable.Map({
      deleteme: 'foo'
    })
    var ds = DataStorage(entries)

    var ds1 = ds.delete('deleteme')

    expect(ds1.read('deleteme')).toEqual('')
    expect(ds1.toJSON()).toEqual("{}")
  })

  it('deletes entries immutably', function() {
    var entries = Immutable.Map({
      'test subject': 'still alive'
    })
    ds = DataStorage(entries)

    ds.delete('test subject')

    expect(ds.read('test subject')).toEqual('still alive')
  })

  it('deletes an entry when an empty string is set as the content', function() {
    var entries = Immutable.Map({
      deleteme: 'foo'
    })
    var ds = DataStorage(entries)

    var ds1 = ds.write('deleteme', '')

    expect(ds1.toJSON()).toEqual("{}")
  })

  it('demands that keys be strings', function() {
    ds = DataStorage(emptyEntries)
    expect(function() { ds.read({}) })
      .toThrowError("DataStorage#read expects to be called with a string, but got [object Object]")

    expect(function() { ds.write({}, 'foo') })
      .toThrowError("DataStorage#write expects to be called with two strings, but got [object Object], foo")
  })

  it('demands that values be strings', function() {
    expect(function() { ds.write('foo', {}) })
      .toThrowError("DataStorage#write expects to be called with two strings, but got foo, [object Object]")
  })
})
