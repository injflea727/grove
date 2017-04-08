var DataCommand = {}

DataCommand.noop = function() {
  return NoopDataCommand()
}

DataCommand.write = function(name, value) {
  return WriteDataCommand(name, value)
}

function WriteDataCommand(name, value) {
  var self

  return self = {
    and: function(cmd) {
      return CompositeDataCommand(self, cmd)
    },
    exec: function(dataRecorder) {
      dataRecorder.write(name, value)
    }
  }
}

function NoopDataCommand() {
  var self

  return self = {
    and: function(cmd) { return cmd },
    exec: function() { return self }
  }
}

function CompositeDataCommand(first, second) {
  var self

  return self = {
    and: function(cmd) {
      return CompositeDataCommand(self, cmd)
    },
    exec: function(dataRecorder) {
      first.exec(dataRecorder)
      second.exec(dataRecorder)
      return self
    }
  }
}
