describe('MainResults, given a raw results object', function() {
  describe('screen', function() {
    it('takes its value from the screen property of the raw object', function() {
      var rawResults = {screen: ['hello']}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['hello'])
    })

    it('wraps strings in an array', function() {
      var rawResults = {screen: 'hello'}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['hello'])
    })

    it('stringifies other values', function() {
      var rawResults = {screen: 0}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['0'])
    })

    it('stringifies arrays of other values', function() {
      var rawResults = {screen: [1, 2, void 0]}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['1', '2', 'undefined'])
    })

    it('outputs "undefined" if there is no screen property', function() {
      var rawResults = {}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['undefined'])
    })
  })

  describe('shouldRedraw', function() {
    it('is true if screen is anything but null', function() {
      var rawResults = {screen: 0}
      var output = MainResults(rawResults).shouldRedraw
      expect(output).toBe(true)
    })

    it('is false if screen is exactly null', function() {
      var rawResults = {screen: null}
      var output = MainResults(rawResults).shouldRedraw
      expect(output).toBe(false)
    })

    it('is true if there is no screen property', function() {
      var rawResults = {}
      var output = MainResults(rawResults).shouldRedraw
      expect(output).toBe(true)
    })
  })

  describe('url', function() {
    it('takes its value from the url property of the raw object', function() {
      var rawResults = {url: 'example.com'}
      var output = MainResults(rawResults).url
      expect(output).toEqual('example.com')
    })

    it('treats anything other than a string as null', function() {
      var rawResults = {url: 123}
      var output = MainResults(rawResults).url
      expect(output).toEqual(null)
    })

    it('is null if there is no url property', function() {
      var rawResults = {}
      var output = MainResults(rawResults).url
      expect(output).toEqual(null)
    })
  })

  describe('print', function() {
    it('is taken from the raw results object', function() {
      var rawResults = {print: 'data'}
      var output = MainResults(rawResults).print
      expect(output).toBe('data')
    })

    it('converts values to strings', function() {
      var rawResults = {print: 0}
      expect(MainResults(rawResults).print).toBe('0')
    })
  })

  describe('shouldPrint', function() {
    it('is true if the raw object has a non-null print property', function() {
      var rawResults = {print: 0}
      var output = MainResults(rawResults).shouldPrint
      expect(output).toBe(true)
    })

    it('is false if there is no print property', function() {
      var rawResults = {}
      var output = MainResults(rawResults).shouldPrint
      expect(output).toBe(false)
    })

    it('is false if the print property is null', function() {
      var rawResults = {print: null}
      var output = MainResults(rawResults).shouldPrint
      expect(output).toBe(false)
    })
  })

  describe('records', function() {
    it('is taken from the raw results object', function() {
      var rawResults = {records: {'foo': 'bar'}}
      var output = MainResults(rawResults).records
      expect(output).toEqual({'foo': 'bar'})
    })

    it('is null if the raw results object does not have records', function() {
      var rawResults = {}
      expect(MainResults(rawResults).records).toBe(null)
    })

    it('is null if the raw records value is not an Object', function() {
      var rawResults = {records: []}
      var output = MainResults(rawResults).records
      expect(output).toEqual(null)
    })
  })
})

describe('MainResults, given basic screen output', function() {
  describe('screen', function() {
    it('is the value passed in', function() {
      var rawResults = ['hello']
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['hello'])
    })

    it('wraps strings in an array', function() {
      var rawResults = {screen: 'hello'}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['hello'])
    })

    it('stringifies other values', function() {
      var rawResults = {screen: 0}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['0'])
    })

    it('stringifies arrays of other values', function() {
      var rawResults = {screen: [1, 2, void 0]}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['1', '2', 'undefined'])
    })

    it('outputs "undefined" if there is no screen property', function() {
      var rawResults = {}
      var output = MainResults(rawResults).screen
      expect(output).toEqual(['undefined'])
    })
  })

  describe('shouldRedraw', function() {
    it('is true if screen is anything but null', function() {
      var rawResults = ''
      var output = MainResults(rawResults).shouldRedraw
      expect(output).toBe(true)
    })

    it('is false if screen is exactly null', function() {
      var rawResults = null
      var output = MainResults(rawResults).shouldRedraw
      expect(output).toBe(false)
    })
  })

  describe('url', function() {
    it('is null', function() {
      var rawResults = ['hello']
      var output = MainResults(rawResults).url
      expect(output).toBe(null)
    })
  })

  describe('shouldPrint', function() {
    it('is false', function() {
      var rawResults = ['hello']
      var output = MainResults(rawResults).shouldPrint
      expect(output).toBe(false)
    })
  })

  describe('records', function() {
    it('is null', function() {
      var rawResults = ['hello']
      var output = MainResults(rawResults).records
      expect(output).toEqual(null)
    })
  })
})
