function ReadOnly(readable) {
  return {
    read: function(prop) {
      return readable.read(prop)
    }
  }
}
